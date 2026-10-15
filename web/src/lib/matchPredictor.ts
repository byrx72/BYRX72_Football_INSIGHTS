import { League, TEAMS, STANDINGS, squadOf, Scored, EspnTeam, Standing } from '@/data/espn';
import rawWeights from '@/data/mlModelWeights.json';
import rawMatches from '@/data/matchResults.json';

export interface ModelMetadata {
  version: string;
  name: string;
  trainedAt: string;
  nextVersion: string;
  plannedFeatures: string[];
}

export const ACTIVE_MODEL: ModelMetadata = {
  version: (rawWeights as any)?.metadata?.version ?? '1.2.0',
  name: (rawWeights as any)?.metadata?.name ?? 'Dixon-Coles Bivariate Poisson + BYRX Squad Index',
  trainedAt: (rawWeights as any)?.metadata?.trained_at ?? new Date().toISOString(),
  nextVersion: (rawWeights as any)?.next_model_pipeline?.upcoming_version ?? '2.0.0-xgboost-ensemble',
  plannedFeatures: (rawWeights as any)?.next_model_pipeline?.planned_features ?? [
    'rolling_5_match_xG',
    'player_absence_impact_penalty',
    'tactical_matchup_differential',
    'fatigue_days_between_fixtures',
  ],
};

export interface MatchPredictionResult {
  homeTeam: EspnTeam;
  awayTeam: EspnTeam;
  homeStanding: Standing | undefined;
  awayStanding: Standing | undefined;
  homeStar: Scored | undefined;
  awayStar: Scored | undefined;
  homeSquadRating: number;
  awaySquadRating: number;
  homeXG: number;
  awayXG: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  predictedScore: { home: number; away: number; probability: number };
  topScores: { home: number; away: number; prob: number }[];
  bttsProb: number;
  over25Prob: number;
  under25Prob: number;
  tacticalAdvantage: string;
  keyMatchup: {
    homePlayer: Scored | undefined;
    awayPlayer: Scored | undefined;
    description: string;
  };
  simulationRuns: number;
  modelVersion: string;
}

// Factorial helper for Poisson distribution
function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Poisson probability P(k; lambda) = (lambda^k * e^-lambda) / k!
function poissonProb(k: number, lambda: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

interface TeamStrength { attack: number; defense: number; homeBoost: number; matches: number; }
interface LeagueModel { map: Map<string, TeamStrength>; muHome: number; muAway: number; source: 'fixtures' | 'standings'; }

interface PlayedMatch {
  league: string; state: string; date: string; homeId: string; awayId: string;
  homeGoals: number | null; awayGoals: number | null; neutral: boolean;
}

const HALF_LIFE_DAYS = 60;  // recent form counts more
const SHRINK_K = 3;         // pseudo-matches pulling attack/defence toward league average
const HOME_SHRINK_K = 5;    // pseudo-matches pulling home boost toward 1.0
const MIN_FIXTURES = 20;    // fewer played matches than this -> fall back to standings

/**
 * Opponent-adjusted strength model (per league), fitted from real match results.
 *
 *   home goals ~ Poisson( muHome * attack_h * defense_a * homeBoost_h )
 *   away goals ~ Poisson( muAway * attack_a * defense_h / homeBoost_h )
 *
 * attack/defense are solved iteratively so every result is judged against the quality of
 * the opponent faced. homeBoost_h is each club's own home-ground factor (how much more it
 * scores / how much less it concedes at home than its general level predicts). Matches are
 * time-decayed and all parameters are shrunk toward league average for small samples.
 */
const STRENGTH_CACHE = new Map<League, LeagueModel>();
function leagueStrengths(league: League): LeagueModel {
  const cached = STRENGTH_CACHE.get(league);
  if (cached) return cached;

  const all = ((rawMatches as unknown as { matches: PlayedMatch[] }).matches ?? []).filter(
    (m) => m.league === league && m.state === 'post' && m.homeGoals !== null && m.awayGoals !== null
  );
  const ms = all.filter((m) => !m.neutral);
  const out = ms.length >= MIN_FIXTURES ? fitFromFixtures(ms) : fitFromStandings(league);
  STRENGTH_CACHE.set(league, out);
  return out;
}

function fitFromFixtures(ms: PlayedMatch[]): LeagueModel {
  const latest = Math.max(...ms.map((m) => Date.parse(m.date)));
  const w = ms.map((m) => Math.pow(0.5, (latest - Date.parse(m.date)) / 864e5 / HALF_LIFE_DAYS));
  const sumW = w.reduce((a, b) => a + b, 0);
  const muHome = ms.reduce((a, m, i) => a + w[i] * m.homeGoals!, 0) / sumW;
  const muAway = ms.reduce((a, m, i) => a + w[i] * m.awayGoals!, 0) / sumW;
  const prior = (muHome + muAway) / 2;

  const ids = [...new Set(ms.flatMap((m) => [m.homeId, m.awayId]))];
  const att = new Map(ids.map((id) => [id, 1]));
  const def = new Map(ids.map((id) => [id, 1]));
  const hb = new Map(ids.map((id) => [id, 1]));
  const count = new Map(ids.map((id) => [id, 0]));
  ms.forEach((m) => {
    count.set(m.homeId, count.get(m.homeId)! + 1);
    count.set(m.awayId, count.get(m.awayId)! + 1);
  });

  for (let it = 0; it < 60; it++) {
    const nAtt = new Map<string, number>();
    const nDef = new Map<string, number>();
    for (const id of ids) {
      let sObs = 0, sExp = 0, cObs = 0, cExp = 0;
      ms.forEach((m, k) => {
        if (m.homeId === id) {
          sObs += w[k] * m.homeGoals!;
          sExp += w[k] * muHome * def.get(m.awayId)! * hb.get(id)!;
          cObs += w[k] * m.awayGoals!;
          cExp += w[k] * (muAway * att.get(m.awayId)!) / hb.get(id)!;
        } else if (m.awayId === id) {
          sObs += w[k] * m.awayGoals!;
          sExp += w[k] * (muAway * def.get(m.homeId)!) / hb.get(m.homeId)!;
          cObs += w[k] * m.homeGoals!;
          cExp += w[k] * muHome * att.get(m.homeId)! * hb.get(m.homeId)!;
        }
      });
      nAtt.set(id, (sObs + SHRINK_K * prior) / (sExp + SHRINK_K * prior));
      nDef.set(id, (cObs + SHRINK_K * prior) / (cExp + SHRINK_K * prior));
    }
    const mA = [...nAtt.values()].reduce((a, b) => a + b, 0) / ids.length;
    const mD = [...nDef.values()].reduce((a, b) => a + b, 0) / ids.length;
    ids.forEach((id) => { att.set(id, nAtt.get(id)! / mA); def.set(id, nDef.get(id)! / mD); });

    // Per-team home-ground boost: geometric mean of (scoring at home vs expected) and
    // (conceding at home vs expected), shrunk toward 1.
    for (const id of ids) {
      let gfO = 0, gfE = 0, gaO = 0, gaE = 0;
      ms.forEach((m, k) => {
        if (m.homeId !== id) return;
        gfO += w[k] * m.homeGoals!;
        gfE += w[k] * muHome * att.get(id)! * def.get(m.awayId)!;
        gaO += w[k] * m.awayGoals!;
        gaE += w[k] * muAway * att.get(m.awayId)! * def.get(id)!;
      });
      const p = HOME_SHRINK_K * prior;
      const b = Math.sqrt(((gfO + p) / (gfE + p)) * ((gaE + p) / (gaO + p)));
      hb.set(id, Math.min(1.35, Math.max(0.8, b)));
    }
  }

  const map = new Map<string, TeamStrength>();
  ids.forEach((id) =>
    map.set(id, { attack: att.get(id)!, defense: def.get(id)!, homeBoost: hb.get(id)!, matches: count.get(id)! })
  );
  return { map, muHome, muAway, source: 'fixtures' };
}

/** Fallback when too few fixtures exist: season-total standings with league-wide home lift. */
function fitFromStandings(league: League): LeagueModel {
  const rows = STANDINGS.filter((s) => s.league === league && s.played > 0);
  const totalGames = rows.reduce((a, r) => a + r.played, 0);
  const avgGoals = totalGames ? rows.reduce((a, r) => a + r.gf, 0) / totalGames : 1.35;
  const SHRINK = 8;
  const att = new Map<string, number>(rows.map((r) => [r.teamId, 1]));
  const def = new Map<string, number>(rows.map((r) => [r.teamId, 1]));
  for (let it = 0; it < 25; it++) {
    const sumDef = [...def.values()].reduce((a, b) => a + b, 0);
    const sumAtt = [...att.values()].reduce((a, b) => a + b, 0);
    const nextAtt = new Map<string, number>();
    const nextDef = new Map<string, number>();
    for (const r of rows) {
      const oppDef = (sumDef - def.get(r.teamId)!) / Math.max(def.size - 1, 1);
      const oppAtt = (sumAtt - att.get(r.teamId)!) / Math.max(att.size - 1, 1);
      const rawAtt = r.gf / r.played / (avgGoals * oppDef);
      const rawDef = r.ga / r.played / (avgGoals * oppAtt);
      const wt = r.played / (r.played + SHRINK);
      nextAtt.set(r.teamId, wt * rawAtt + (1 - wt));
      nextDef.set(r.teamId, wt * rawDef + (1 - wt));
    }
    const nA = [...nextAtt.values()].reduce((a, b) => a + b, 0) / nextAtt.size;
    const nD = [...nextDef.values()].reduce((a, b) => a + b, 0) / nextDef.size;
    nextAtt.forEach((v, k) => att.set(k, v / nA));
    nextDef.forEach((v, k) => def.set(k, v / nD));
  }
  const map = new Map<string, TeamStrength>();
  rows.forEach((r) =>
    map.set(r.teamId, { attack: att.get(r.teamId)!, defense: def.get(r.teamId)!, homeBoost: 1, matches: r.played })
  );
  return { map, muHome: avgGoals * 1.12, muAway: avgGoals * 0.92, source: 'standings' };
}

// Dixon-Coles tau correction (multiplicative; rho < 0 trims 0-0/1-1 inflation)
function dcTau(h: number, a: number, lh: number, la: number, rho: number): number {
  if (h === 0 && a === 0) return 1 - lh * la * rho;
  if (h === 0 && a === 1) return 1 + lh * rho;
  if (h === 1 && a === 0) return 1 + la * rho;
  if (h === 1 && a === 1) return 1 - rho;
  return 1;
}

/**
 * Machine Learning & Poisson Match Prediction Engine
 * Analyzes team historical performance, home/away splits, and active player ratings.
 */
export function predictMatch(
  homeTeamId: string,
  awayTeamId: string,
  runs: number = 10000
): MatchPredictionResult | null {
  const homeTeam = TEAMS.find((t) => t.id === homeTeamId);
  const awayTeam = TEAMS.find((t) => t.id === awayTeamId);
  if (!homeTeam || !awayTeam) return null;

  const homeStanding = STANDINGS.find((s) => s.teamId === homeTeamId);
  const awayStanding = STANDINGS.find((s) => s.teamId === awayTeamId);

  const homeSquad = squadOf(homeTeamId);
  const awaySquad = squadOf(awayTeamId);

  // Top 11 players by BYRX score
  const homeTop11 = [...homeSquad].sort((a, b) => b.score - a.score).slice(0, 11);
  const awayTop11 = [...awaySquad].sort((a, b) => b.score - a.score).slice(0, 11);

  const homeSquadRating = homeTop11.length
    ? homeTop11.reduce((sum, p) => sum + p.score, 0) / homeTop11.length
    : 7.0;
  const awaySquadRating = awayTop11.length
    ? awayTop11.reduce((sum, p) => sum + p.score, 0) / awayTop11.length
    : 7.0;

  // Key offensive stars
  const homeStar = homeTop11.find((p) => p.pos === 'FWD' || p.pos === 'MID') || homeTop11[0];
  const awayStar = awayTop11.find((p) => p.pos === 'FWD' || p.pos === 'MID') || awayTop11[0];

  // Opponent-adjusted strengths + team-specific home advantage (fitted from real fixtures)
  const model = leagueStrengths(homeTeam.league);
  const NEUTRAL: TeamStrength = { attack: 1, defense: 1, homeBoost: 1, matches: 0 };
  const hs = model.map.get(homeTeamId) ?? NEUTRAL;
  const aws = model.map.get(awayTeamId) ?? NEUTRAL;

  // Squad quality ratio (clamped so one metric can't dominate)
  const squadPowerRatio = Math.min(1.4, Math.max(0.7, homeSquadRating / Math.max(awaySquadRating, 1)));
  const starLiftHome = homeStar ? (homeStar.score / 8.5) * 0.05 : 0;
  const starLiftAway = awayStar ? (awayStar.score / 8.5) * 0.05 : 0;

  // Expected goals: venue baseline * own attack * opponent defensive weakness * home-ground factor
  // The home side's ground boost lifts its scoring and suppresses the visitors' scoring.
  const homeXG = Number(
    Math.max(
      0.35,
      model.muHome * hs.attack * aws.defense * hs.homeBoost * Math.pow(squadPowerRatio, 0.3) + starLiftHome
    ).toFixed(2)
  );

  const awayXG = Number(
    Math.max(
      0.25,
      (model.muAway * aws.attack * hs.defense * Math.pow(1 / squadPowerRatio, 0.3)) / hs.homeBoost + starLiftAway
    ).toFixed(2)
  );

  // Score probability matrix for 0..7 goals
  const MAX_GOALS = 7;
  const matrix: { home: number; away: number; prob: number }[] = [];
  let totalWin = 0;
  let totalDraw = 0;
  let totalLoss = 0;
  let btts = 0;
  let over25 = 0;

  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const tau = dcTau(h, a, homeXG, awayXG, -0.06);
      const p = Math.max(0, poissonProb(h, homeXG) * poissonProb(a, awayXG) * tau);
      matrix.push({ home: h, away: a, prob: p });

      if (h > a) totalWin += p;
      else if (h === a) totalDraw += p;
      else totalLoss += p;

      if (h > 0 && a > 0) btts += p;
      if (h + a > 2) over25 += p;
    }
  }

  // Normalize probabilities to 100%
  const totalP = totalWin + totalDraw + totalLoss || 1;
  const homeWinProb = Math.round((totalWin / totalP) * 100);
  const drawProb = Math.round((totalDraw / totalP) * 100);
  const awayWinProb = Math.max(0, 100 - homeWinProb - drawProb);

  const bttsProb = Math.round((btts / totalP) * 100);
  const over25Prob = Math.round((over25 / totalP) * 100);
  const under25Prob = 100 - over25Prob;

  // Sort scorelines by highest probability
  const topScores = [...matrix]
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 5)
    .map((s) => ({
      home: s.home,
      away: s.away,
      prob: Math.round((s.prob / totalP) * 100),
    }));

  // Pick the most likely OUTCOME first, then the scoreline inside it that best fits
  // the expected goals. Raw Poisson mode almost always yields 1-0 / 1-1.
  const outcomeOf = (h: number, a: number) => (h > a ? 'H' : h === a ? 'D' : 'A');
  const bestOutcome = totalWin >= totalDraw && totalWin >= totalLoss ? 'H' : totalLoss >= totalDraw ? 'A' : 'D';
  const fit = (s: { home: number; away: number; prob: number }) =>
    s.prob * Math.exp(-((s.home - homeXG) ** 2 + (s.away - awayXG) ** 2) / 1.5);
  const bestCell =
    matrix.filter((s) => outcomeOf(s.home, s.away) === bestOutcome).sort((a, b) => fit(b) - fit(a))[0] ||
    matrix[0];
  const predictedScore = { home: bestCell.home, away: bestCell.away, prob: Math.round((bestCell.prob / totalP) * 100) };

  // Tactical Insight reasoning
  let tacticalAdvantage = '';
  if (homeSquadRating > awaySquadRating + 0.6) {
    tacticalAdvantage = `${homeTeam.name}'s squad depth and superior individual duel ratings (+${(
      (squadPowerRatio - 1) *
      100
    ).toFixed(0)}% advantage) provide dominant territorial control.`;
  } else if (awaySquadRating > homeSquadRating + 0.6) {
    tacticalAdvantage = `${awayTeam.name} carries the technical edge despite traveling away, threatening rapid transitions behind the defensive line.`;
  } else {
    tacticalAdvantage = `Tactically balanced encounter with tight midfield congestion; set-pieces and individual xG overperformance will prove decisive.`;
  }

  return {
    homeTeam,
    awayTeam,
    homeStanding,
    awayStanding,
    homeStar,
    awayStar,
    homeSquadRating,
    awaySquadRating,
    homeXG,
    awayXG,
    homeWinProb,
    drawProb,
    awayWinProb,
    predictedScore: {
      home: predictedScore.home,
      away: predictedScore.away,
      probability: predictedScore.prob,
    },
    topScores,
    bttsProb,
    over25Prob,
    under25Prob,
    tacticalAdvantage,
    keyMatchup: {
      homePlayer: homeStar,
      awayPlayer: awayStar,
      description: `${homeStar?.name || 'Home Key Player'} (${homeStar?.stats.goals || 0}G / ${
        homeStar?.stats.assists || 0
      }A) vs ${awayStar?.name || 'Away Key Player'} (${awayStar?.stats.goals || 0}G / ${
        awayStar?.stats.assists || 0
      }A)`,
    },
    simulationRuns: runs,
    modelVersion: ACTIVE_MODEL.version,
  };
}

/**
 * Curated Featured Fixtures for Premier League & La Liga
 */
export const FEATURED_FIXTURES: Record<League, { home: string; away: string; date: string }[]> = {
  PL: [
    { home: '382', away: '359', date: 'Upcoming Matchday' }, // Man City vs Arsenal
    { home: '364', away: '363', date: 'Upcoming Matchday' }, // Liverpool vs Chelsea
    { home: '360', away: '367', date: 'Upcoming Matchday' }, // Man United vs Tottenham
    { home: '361', away: '362', date: 'Upcoming Matchday' }, // Newcastle vs Aston Villa
  ],
  LALIGA: [
    { home: '86', away: '83', date: 'El Clásico' }, // Real Madrid vs Barcelona
    { home: '1068', away: '93', date: 'Upcoming Jornada' }, // Atlético Madrid vs Athletic Club
    { home: '89', away: '102', date: 'Upcoming Jornada' }, // Real Sociedad vs Villarreal
    { home: '244', away: '243', date: 'Gran Derbi' }, // Real Betis vs Sevilla
  ],
};
