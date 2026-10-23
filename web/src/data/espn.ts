import raw from './espnDb.json';

export type Pos = 'GK' | 'DEF' | 'MID' | 'FWD';
export type League = 'PL' | 'LALIGA';

export interface EspnPlayer {
  id: string; name: string; short: string; teamId: string; team: string; teamShort: string;
  crest: string; league: League; pos: Pos; jersey: string; age: number | null;
  nationality: string; flag: string; headshot: string; height: string; weight: string;
  stats: {
    apps: number; subIns: number; goals: number; assists: number; shots: number; sot: number;
    yc: number; rc: number; fc: number; fa: number; offsides: number; saves: number; shotsFaced: number; ga: number;
  };
}
export interface EspnTeam { id: string; league: League; name: string; short: string; color: string; crest: string }
export interface Standing {
  league: League; teamId: string; team: string; rank: number; played: number; wins: number;
  draws: number; losses: number; gf: number; ga: number; gd: number; points: number;
}
export interface Scored extends EspnPlayer {
  score: number; context: number; minutes: number; rank: number; per90: number;
}

const db = raw as unknown as {
  generatedAt: string; season: string; teams: EspnTeam[]; players: EspnPlayer[]; standings: Standing[];
};

export const GENERATED_AT = db.generatedAt;
export const SEASON = db.season;
export const TEAMS = db.teams;
export const STANDINGS = db.standings;
export const ALL_PLAYERS = db.players;

export const LEAGUE_LOGOS: Record<
  League,
  {
    dark: string;
    light: string;
    name: string;
    short: string;
    color: string;
    glow: string;
    accent: string;
    country: string;
  }
> = {
  PL: {
    dark: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/23.png',
    light: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png',
    name: 'Premier League',
    short: 'PL',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    accent: '#0284c7',
    country: 'England',
  },
  LALIGA: {
    dark: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/15.png',
    light: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png',
    name: 'La Liga',
    short: 'LL',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.45)',
    accent: '#ea580c',
    country: 'Spain',
  },
};

const rankByTeam = new Map(db.standings.map((s) => [s.teamId, s]));

/** Raw value-added per appearance, position specific. */
function raw1(p: EspnPlayer, teamGA: number, teamPlayed: number): number {
  const s = p.stats;
  const a = Math.max(s.apps, 1);
  const disc = s.yc * 0.4 + s.rc * 2;
  switch (p.pos) {
    case 'FWD': return (s.goals * 5 + s.assists * 3 + s.sot * 0.5 + s.shots * 0.15 + s.fa * 0.05 - disc) / a;
    case 'MID': return (s.goals * 5.5 + s.assists * 4 + s.sot * 0.5 + s.shots * 0.2 + s.fa * 0.1 - s.fc * 0.03 - disc) / a;
    case 'DEF': return (s.goals * 7 + s.assists * 4.5 + s.sot * 0.4 + s.fa * 0.08 - s.fc * 0.04 - disc - (teamGA / Math.max(teamPlayed, 1)) * 0.8) / a + 2;
    case 'GK': {
      const sv = s.shotsFaced ? s.saves / s.shotsFaced : 0.7;
      return (s.saves * 0.5 - s.ga * 1.2) / a + sv * 6;
    }
  }
}

function build(): Scored[] {
  const out: Scored[] = [];
  (['FWD', 'MID', 'DEF', 'GK'] as Pos[]).forEach((pos) => {
    const group = db.players.filter((p) => p.pos === pos);
    const rows = group.map((p) => {
      const st = rankByTeam.get(p.teamId);
      return { p, v: raw1(p, st?.ga ?? 0, st?.played ?? 0), st };
    });
    const qualified = rows.filter((r) => r.p.stats.apps >= 1).map((r) => r.v).sort((a, b) => a - b);
    rows.forEach(({ p, v, st }) => {
      const pct = qualified.length ? qualified.filter((x) => x <= v).length / qualified.length : 0;
      const minutes = Math.max(p.stats.apps * 82 - p.stats.subIns * 45, 0);
      const base = p.stats.apps ? 5 + pct * 4.9 : 0;
      const strength = st ? 1.25 - ((st.rank - 1) / 39) * 0.25 : 1.1; // club-strength lift
      const context = st ? 1 + (1 - (st.rank - 1) / 19) * 0.25 : 1.1;
      // minutes confidence: small samples are pulled toward the mean
      const conf = Math.min(1, p.stats.apps / 4);
      const score = p.stats.apps ? Math.min(9.99, 6 + (base - 6) * conf + (strength - 1.125) * 0.8) : 0;
      out.push({ ...p, score, context, minutes, rank: 0, per90: minutes ? (p.stats.goals + p.stats.assists) / (minutes / 90) : 0 });
    });
  });
  return out;
}

export const SCORED: Scored[] = build();

export function leaguePlayers(league: League, pos: Pos | 'ALL' = 'ALL'): Scored[] {
  const rows = SCORED.filter((p) => p.league === league && p.stats.apps > 0 && (pos === 'ALL' || p.pos === pos))
    .sort((a, b) => b.score - a.score);
  rows.forEach((p, i) => (p.rank = i + 1));
  return rows;
}

export function standingsFor(league: League): Standing[] {
  return STANDINGS.filter((s) => s.league === league).sort((a, b) => a.rank - b.rank);
}

export function teamsFor(league: League): EspnTeam[] {
  return TEAMS.filter((t) => t.league === league).sort((a, b) => a.name.localeCompare(b.name));
}

export function squadOf(teamId: string): Scored[] {
  const order: Record<Pos, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  return SCORED.filter((p) => p.teamId === teamId).sort((a, b) => order[a.pos] - order[b.pos] || Number(a.jersey) - Number(b.jersey));
}

export function teamOfTheWeek(league: League): Scored[] {
  const take = (pos: Pos, n: number) => leaguePlayers(league, pos).slice(0, n);
  return [...take('GK', 1), ...take('DEF', 4), ...take('MID', 3), ...take('FWD', 3)];
}

export function leagueStats(league: League) {
  const ps = leaguePlayers(league);
  const goals = ps.reduce((a, p) => a + p.stats.goals, 0);
  const assists = ps.reduce((a, p) => a + p.stats.assists, 0);
  const avg = ps.length ? ps.reduce((a, p) => a + p.score, 0) / ps.length : 0;
  const played = Math.max(...standingsFor(league).map((s) => s.played), 0);
  return { goals, assists, avg, played, players: ps.length, clubs: teamsFor(league).length };
}
