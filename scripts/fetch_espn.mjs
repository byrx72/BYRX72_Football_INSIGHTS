// Builds the full 2026/27 database from ESPN's public soccer API.
// Usage: node scripts/fetch_espn.mjs   (re-run any time to refresh live stats)
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const LEAGUES = [
  { id: 'PL', slug: 'eng.1', name: 'Premier League', country: 'England' },
  { id: 'LALIGA', slug: 'esp.1', name: 'La Liga', country: 'Spain' },
];

const get = async (url) => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (r.ok) return await r.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 600));
  }
  return null;
};

const statMap = (athlete) => {
  const out = {};
  for (const cat of athlete.statistics?.splits?.categories ?? [])
    for (const s of cat.stats ?? []) out[s.name] = s.value ?? 0;
  return out;
};

const POS = { G: 'GK', D: 'DEF', M: 'MID', F: 'FWD' };

const db = { generatedAt: new Date().toISOString(), season: '2026/27', source: 'ESPN', leagues: [], teams: [], players: [], standings: [] };

for (const lg of LEAGUES) {
  const t = await get(`${BASE}/${lg.slug}/teams`);
  const teams = t?.sports?.[0]?.leagues?.[0]?.teams?.map((x) => x.team) ?? [];
  db.leagues.push({ id: lg.id, name: lg.name, country: lg.country, slug: lg.slug, clubs: teams.length });

  const st = await get(`https://site.api.espn.com/apis/v2/sports/soccer/${lg.slug}/standings`);
  for (const e of st?.children?.[0]?.standings?.entries ?? []) {
    const s = Object.fromEntries(e.stats.map((x) => [x.name, x.value]));
    db.standings.push({
      league: lg.id, teamId: e.team.id, team: e.team.displayName,
      rank: s.rank, played: s.gamesPlayed, wins: s.wins, draws: s.ties, losses: s.losses,
      gf: s.pointsFor, ga: s.pointsAgainst, gd: s.pointDifferential, points: s.points,
    });
  }

  for (const team of teams) {
    const crest = team.logos?.[0]?.href ?? '';
    db.teams.push({
      id: team.id, league: lg.id, name: team.displayName, short: team.abbreviation,
      color: team.color ? `#${team.color}` : '#1f2a22', crest,
    });
    const r = await get(`${BASE}/${lg.slug}/teams/${team.id}/roster`);
    for (const a of r?.athletes ?? []) {
      const s = statMap(a);
      db.players.push({
        id: a.id, name: a.displayName, short: a.shortName ?? a.displayName,
        teamId: team.id, team: team.displayName, teamShort: team.abbreviation, crest, league: lg.id,
        pos: POS[a.position?.abbreviation] ?? 'MID', jersey: a.jersey ?? '',
        age: a.age ?? null, nationality: a.citizenship ?? '', flag: a.flag?.href ?? '',
        headshot: a.headshot?.href ?? `https://a.espncdn.com/i/headshots/soccer/players/full/${a.id}.png`,
        height: a.displayHeight ?? '', weight: a.displayWeight ?? '',
        stats: {
          apps: s.appearances ?? 0, subIns: s.subIns ?? 0, goals: s.totalGoals ?? 0, assists: s.goalAssists ?? 0,
          shots: s.totalShots ?? 0, sot: s.shotsOnTarget ?? 0, yc: s.yellowCards ?? 0, rc: s.redCards ?? 0,
          fc: s.foulsCommitted ?? 0, fa: s.foulsSuffered ?? 0, offsides: s.offsides ?? 0,
          saves: s.saves ?? 0, shotsFaced: s.shotsFaced ?? 0, ga: s.goalsConceded ?? 0,
        },
      });
    }
    console.log(`${lg.id} ${team.displayName}: ${db.players.filter((p) => p.teamId === team.id).length} players`);
  }
}

mkdirSync('web/src/data', { recursive: true });
writeFileSync('web/src/data/espnDb.json', JSON.stringify(db));
mkdirSync('database', { recursive: true });
writeFileSync('database/espn_2026_27.json', JSON.stringify(db, null, 2));
console.log(`DONE: ${db.teams.length} teams, ${db.players.length} players, ${db.standings.length} standings rows`);
