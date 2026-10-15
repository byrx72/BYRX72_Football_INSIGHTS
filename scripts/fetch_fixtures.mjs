// Fetches every played match (and the next upcoming fixtures) of the 2026/27 season from ESPN.
// Used to compute opponent-adjusted team strength and home-advantage in pipeline/ml_engine.py.
// Usage: node scripts/fetch_fixtures.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const LEAGUES = [
  { id: 'PL', slug: 'eng.1' },
  { id: 'LALIGA', slug: 'esp.1' },
];
const SEASON_START = new Date('2026-08-01T00:00:00Z');
const LOOKAHEAD_DAYS = 21;

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

const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');
const days = [];
const end = new Date(Date.now() + LOOKAHEAD_DAYS * 864e5);
for (let d = new Date(SEASON_START); d <= end; d = new Date(d.getTime() + 864e5)) days.push(new Date(d));

const matches = new Map();
for (const lg of LEAGUES) {
  for (let i = 0; i < days.length; i += 8) {
    const batch = days.slice(i, i + 8);
    const res = await Promise.all(batch.map((d) => get(`${BASE}/${lg.slug}/scoreboard?dates=${ymd(d)}`)));
    for (const j of res) {
      for (const ev of j?.events ?? []) {
        const c = ev.competitions?.[0];
        const home = c?.competitors?.find((x) => x.homeAway === 'home');
        const away = c?.competitors?.find((x) => x.homeAway === 'away');
        if (!home || !away) continue;
        const state = ev.status?.type?.state; // pre | in | post
        matches.set(ev.id, {
          id: ev.id, league: lg.id, date: ev.date, state,
          homeId: home.team.id, awayId: away.team.id,
          homeGoals: state === 'post' ? Number(home.score) : null,
          awayGoals: state === 'post' ? Number(away.score) : null,
          neutral: !!c.neutralSite,
          attendance: c.attendance ?? null,
        });
      }
    }
  }
  console.log(`${lg.id}: ${[...matches.values()].filter((m) => m.league === lg.id).length} matches`);
}

const all = [...matches.values()].sort((a, b) => a.date.localeCompare(b.date));
const out = { generatedAt: new Date().toISOString(), season: '2026/27', matches: all };
mkdirSync('web/src/data', { recursive: true });
writeFileSync('web/src/data/matchResults.json', JSON.stringify(out));
mkdirSync('database', { recursive: true });
writeFileSync('database/match_results_2026_27.json', JSON.stringify(out, null, 2));
console.log(`DONE: ${all.filter((m) => m.state === 'post').length} played, ${all.filter((m) => m.state === 'pre').length} upcoming`);
