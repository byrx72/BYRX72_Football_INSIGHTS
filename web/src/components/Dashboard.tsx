'use client';

import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, BarChart3, Shield, GitCompare, Table2, Users, BookOpen, Search, Menu, X, ArrowUpRight, Activity, Target, Sparkles, Gauge, Brain, Flame, Trophy, SlidersHorizontal, ArrowUpDown,
} from 'lucide-react';
import '@/app/dashboard.css';
import {
  League, Pos, Scored, GENERATED_AT, SEASON, ALL_PLAYERS, leaguePlayers, leagueStats, standingsFor, teamsFor, squadOf, teamOfTheWeek, SCORED, TEAMS, LEAGUE_LOGOS,
} from '@/data/espn';
import { CinematicLeagueAtmosphere } from './CinematicLeagueAtmosphere';
import { ActivityShowcase } from './ActivityShowcase';
import { RichPlayerProfileModal } from './RichPlayerProfileModal';
import { MatchPredictorView } from './MatchPredictorView';
import { getPlayerPhoto } from '@/lib/playerPhotos';

type View = 'overview' | 'predict' | 'leaderboard' | 'totw' | 'compare' | 'table' | 'clubs' | 'method';

const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'predict', label: 'AI Match Predictor', icon: <Brain size={18} /> },
  { id: 'leaderboard', label: 'Leaderboard', icon: <BarChart3 size={18} /> },
  { id: 'totw', label: 'Team of the Week', icon: <Shield size={18} /> },
  { id: 'compare', label: 'Compare players', icon: <GitCompare size={18} /> },
  { id: 'table', label: 'League table', icon: <Table2 size={18} /> },
  { id: 'clubs', label: 'Clubs & squads', icon: <Users size={18} /> },
];

const LEAGUE_NAME: Record<League, string> = { PL: 'Premier League', LALIGA: 'La Liga' };
const POS_COL: Record<Pos, string> = { GK: '#f5c46b', DEF: '#6bc4f5', MID: '#b48bf5', FWD: '#f57b7b' };
const initials = (n: string) => n.split(' ').map((x) => x[0]).slice(0, 2).join('');

function Avatar({ p, cls }: { p: Scored; cls: string }) {
  const photo = getPlayerPhoto(p);
  const [imgSrc, setImgSrc] = useState(photo);
  const [bad, setBad] = useState(false);

  // If player object changes, update photo
  React.useEffect(() => {
    setImgSrc(getPlayerPhoto(p));
    setBad(false);
  }, [p]);

  if (bad)
    return (
      <div className={cls} style={{ display: 'grid', placeItems: 'center', fontWeight: 800, color: '#ffffff', background: 'linear-gradient(135deg, #1e293b, #0f172a)', fontSize: 13, border: '1px solid rgba(255,255,255,0.1)' }}>
        {initials(p.name)}
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      className={cls}
      src={imgSrc}
      alt={p.name}
      loading="lazy"
      onError={() => {
        setBad(true);
      }}
    />
  );
}

/* ───────────── Graphics ───────────── */

function Histogram({ values }: { values: number[] }) {
  const bins = Array.from({ length: 10 }, (_, i) => 5 + i * 0.5);
  const counts = bins.map((b) => values.filter((v) => v >= b && v < b + 0.5).length);
  const max = Math.max(...counts, 1);
  return (
    <svg viewBox="0 0 420 190" style={{ width: '100%', flex: 1 }}>
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d6f77b" /><stop offset="100%" stopColor="#3f6b2a" /></linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => <line key={i} x1="0" x2="420" y1={20 + i * 42} y2={20 + i * 42} stroke="rgba(214,247,123,.07)" />)}
      {counts.map((c, i) => {
        const h = (c / max) * 130;
        return (
          <g key={i}>
            <rect x={14 + i * 40} y={150 - h} width="30" height={h} rx="6" fill="url(#hg)" opacity={0.55 + (i / 10) * 0.45}>
              <animate attributeName="height" from="0" to={h} dur="0.8s" fill="freeze" />
              <animate attributeName="y" from="150" to={150 - h} dur="0.8s" fill="freeze" />
            </rect>
            <text x={29 + i * 40} y="168" fill="#8b9b8e" fontSize="10" textAnchor="middle">{bins[i].toFixed(1)}</text>
            {c > 0 && <text x={29 + i * 40} y={144 - h} fill="#d6f77b" fontSize="10" textAnchor="middle">{c}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let acc = 0;
  const R = 52, C = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg viewBox="0 0 140 140" width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="16" />
        {data.map((d) => {
          const len = (d.value / total) * C;
          const el = <circle key={d.label} cx="70" cy="70" r={R} fill="none" stroke={d.color} strokeWidth="16" strokeDasharray={`${len - 3} ${C}`} strokeDashoffset={-acc} strokeLinecap="round" />;
          acc += len;
          return el;
        })}
      </svg>
      <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
            <span style={{ color: '#8b9b8e', width: 54 }}>{d.label}</span>
            <b className="num">{d.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarList({ rows, color = '#d6f77b' }: { rows: { label: string; value: number; img?: string }[]; color?: string }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div style={{ display: 'grid', gap: 11 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 34px', gap: 10, alignItems: 'center', fontSize: 12.5 }}>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#8b9b8e', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {r.img && /* eslint-disable-next-line @next/next/no-img-element */ <img src={r.img} alt="" className="crest" style={{ width: 18, height: 18 }} />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
          </span>
          <div className="scorebar" style={{ marginTop: 0, height: 8 }}><i style={{ width: `${(r.value / max) * 100}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }} /></div>
          <b className="num" style={{ textAlign: 'right' }}>{r.value}</b>
        </div>
      ))}
    </div>
  );
}

function pct(p: Scored, pool: Scored[], f: (x: Scored) => number) {
  const v = f(p);
  return Math.round((pool.filter((x) => f(x) <= v).length / pool.length) * 100);
}
function radarVals(p: Scored): number[] {
  const pool = SCORED.filter((x) => x.stats.apps > 0 && x.league === p.league);
  const a = (x: Scored) => Math.max(x.stats.apps, 1);
  return [
    pct(p, pool, (x) => x.stats.goals / a(x)),
    pct(p, pool, (x) => x.stats.assists / a(x)),
    pct(p, pool, (x) => x.stats.sot / a(x)),
    pct(p, pool, (x) => x.stats.fa / a(x)),
    pct(p, pool, (x) => -(x.stats.yc + x.stats.rc * 3) / a(x)),
    pct(p, pool, (x) => x.stats.apps),
  ];
}
const AXES = ['Goals', 'Creation', 'Shooting', 'Duels won', 'Discipline', 'Availability'];

function Radar({ players, colors }: { players: Scored[]; colors: string[] }) {
  const cx = 150, cy = 150, R = 105;
  const pt = (i: number, v: number) => {
    const ang = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return [cx + Math.cos(ang) * R * (v / 100), cy + Math.sin(ang) * R * (v / 100)];
  };
  return (
    <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 380, margin: '0 auto', display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={AXES.map((_, i) => pt(i, k * 100).join(',')).join(' ')} fill="none" stroke="rgba(214,247,123,.12)" />
      ))}
      {AXES.map((l, i) => {
        const [x, y] = pt(i, 100), [lx, ly] = pt(i, 122);
        return (
          <g key={l}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(214,247,123,.1)" />
            <text x={lx} y={ly} fill="#8b9b8e" fontSize="10" textAnchor="middle" dominantBaseline="middle">{l}</text>
          </g>
        );
      })}
      {players.map((p, k) => (
        <polygon key={p.id} points={radarVals(p).map((v, i) => pt(i, v).join(',')).join(' ')} fill={colors[k]} fillOpacity=".18" stroke={colors[k]} strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ───────────── Views ───────────── */

function PlayerRow({ p, onOpen }: { p: Scored; onOpen: (p: Scored) => void }) {
  const isGold = p.rank === 1;
  const isSilver = p.rank === 2;
  const isBronze = p.rank === 3;

  return (
    <button className="player-row" onClick={() => onOpen(p)}>
      <span>
        {isGold ? (
          <span className="rank-badge rank-gold" title="Rank 1">#01</span>
        ) : isSilver ? (
          <span className="rank-badge rank-silver" title="Rank 2">#02</span>
        ) : isBronze ? (
          <span className="rank-badge rank-bronze" title="Rank 3">#03</span>
        ) : (
          <span className="rank">{String(p.rank).padStart(2, '0')}</span>
        )}
      </span>
      <span className="player-cell">
        <Avatar p={p} cls="row-avatar" />
        <span style={{ minWidth: 0 }}>
          <span className="player-name">{p.name}</span>
          <span className="player-sub">{p.nationality || '—'} · {p.stats.apps} apps</span>
        </span>
      </span>
      <span className="club-cell">{/* eslint-disable-next-line @next/next/no-img-element */}<img className="crest" src={p.crest} alt="" /><span>{p.team}</span></span>
      <span><span className={`position-tag pos-${p.pos}`}>{p.pos}</span></span>
      <span>
        <span className="score-cell">{p.score.toFixed(2)}</span>
        <div className="scorebar">
          <i
            style={{
              width: `${(p.score / 10) * 100}%`,
              background: p.score >= 8.5
                ? 'linear-gradient(90deg, #38bdf8, #00ff87)'
                : p.score >= 7.0
                ? 'linear-gradient(90deg, #a855f7, #38bdf8)'
                : 'linear-gradient(90deg, #64748b, #94a3b8)',
            }}
          />
        </div>
      </span>
      <span className="num">{p.stats.goals}<span style={{ color: '#55635a' }}> G</span></span>
      <span className="num">{p.stats.assists}<span style={{ color: '#55635a' }}> A</span></span>
      <span className="context-cell"><strong>{p.context.toFixed(2)}×</strong></span>
    </button>
  );
}

function Leaderboard({ rows, onOpen }: { rows: Scored[]; onOpen: (p: Scored) => void }) {
  return (
    <div className="leaderboard panel">
      <div className="table-head"><span>#</span><span>Player</span><span>Club</span><span>Pos</span><span>BYRX score</span><span>Goals</span><span>Assists</span><span>Context</span></div>
      {rows.map((p) => <PlayerRow key={p.id} p={p} onOpen={onOpen} />)}
      {!rows.length && <div style={{ padding: 40, textAlign: 'center', color: '#8b9b8e' }}>No players match.</div>}
    </div>
  );
}

function Overview({ league, onOpen, go }: { league: League; onOpen: (p: Scored) => void; go: (v: View) => void }) {
  const all = leaguePlayers(league);
  const top = all[0];
  const ls = leagueStats(league);
  const std = standingsFor(league);
  const scorers = [...all].sort((a, b) => b.stats.goals - a.stats.goals).slice(0, 6);
  const creators = [...all].sort((a, b) => b.stats.assists - a.stats.assists).slice(0, 6);
  const posCount = (['GK', 'DEF', 'MID', 'FWD'] as Pos[]).map((k) => ({ label: k, value: all.filter((p) => p.pos === k).length, color: POS_COL[k] }));
  const teamGoals = std.map((s) => ({ label: s.team, value: s.gf, img: TEAMS.find((t) => t.id === s.teamId)?.crest })).sort((a, b) => b.value - a.value).slice(0, 8);
  const availableStars = all.slice(0, 8);

  return (
    <>
      {/* 4-Card UI Showcase from reference image */}
      {top && (
        <ActivityShowcase
          league={league}
          featuredPlayer={top}
          onOpenPlayer={onOpen}
          onExploreMore={() => go('leaderboard')}
          availableStars={availableStars}
        />
      )}

      <div className="page-heading">
        <div>
          <div className="eyebrow">{LEAGUE_NAME[league]} / matchweek {String(ls.played).padStart(2, '0')}</div>
          <h1>Influence,<br /><em>quantified.</em></h1>
        </div>
        <p>Traditional stats count output. BYRX72 measures the full picture — role, context, and the moments that move a match. Live from ESPN, {SEASON}.</p>
      </div>
      <div className="dashboard-grid">
        <div className="hero-card panel">
          <div className="hero-top">
            <div>
              <div className="eyebrow flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Trophy size={11} className="text-amber-400" />
                  LEAGUE MVP FRONT-RUNNER
                </span>
                <span className="hidden sm:inline" style={{ color: '#64748b' }}>·</span>
                <span className="hidden sm:inline font-mono">{league === 'PL' ? 'England' : 'Spain'}</span>
              </div>
              <div style={{ color: '#8b9b8e', fontSize: 11, marginTop: 8 }}>Position-adjusted season impact score</div>
            </div>
            <div className="hero-rating">{top?.score.toFixed(2)}<small>/10</small></div>
          </div>
          {top && (
            <>
              <div className="hero-main">
                <Avatar p={top} cls="hero-avatar" />
                <div>
                  <div className="hero-player-label">Current #01 in League</div>
                  <h2 className="hero-player">{top.name}</h2>
                  <div className="hero-club">{/* eslint-disable-next-line @next/next/no-img-element */}<img className="crest" src={top.crest} alt="" />{top.team} · {top.pos} · {top.minutes} mins</div>
                </div>
              </div>
              <div className="hero-meta">
                <div className="hero-meta-item">
                  <span className="flex items-center gap-1 text-slate-400"><Flame size={11} className="text-orange-400" /> Goals</span>
                  <b>{top.stats.goals}</b>
                </div>
                <div className="hero-meta-item">
                  <span className="flex items-center gap-1 text-slate-400"><Sparkles size={11} className="text-amber-400" /> Assists</span>
                  <b>{top.stats.assists}</b>
                </div>
                <div className="hero-meta-item">
                  <span className="flex items-center gap-1 text-slate-400"><Activity size={11} className="text-emerald-400" /> Context</span>
                  <b>{top.context.toFixed(2)}×</b>
                </div>
                <button className="text-btn group" onClick={() => onOpen(top)}>
                  <span>View profile</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
        <div className="chart-panel panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Score distribution</h2><p className="panel-kicker">Players per BYRX score band · {all.length} rated</p></div>
            <div className="eyebrow">avg {ls.avg.toFixed(2)}</div>
          </div>
          <Histogram values={all.map((p) => p.score)} />
          <div className="legend"><span><i style={{ background: '#d6f77b' }} />Players in band</span><span><i style={{ background: '#3f6b2a' }} />Lower bound of band</span></div>
        </div>
        <div className="metric-grid">
          {[
            { l: 'Goals scored', v: ls.goals.toLocaleString(), t: `${ls.clubs} clubs · MW ${ls.played}`, i: <Target size={14} /> },
            { l: 'Avg. score', v: ls.avg.toFixed(2), t: `${ls.players} players rated`, i: <Gauge size={14} /> },
            { l: 'Assists', v: ls.assists.toLocaleString(), t: 'Provided by squads', i: <Sparkles size={14} /> },
            { l: 'Data source', v: 'ESPN', t: `Synced ${new Date(GENERATED_AT).toLocaleString()}`, i: <Activity size={14} /> },
          ].map((m) => (
            <div className="metric-card" key={m.l}>
              <div className="metric-top"><span>{m.l}</span>{m.i}</div>
              <div className="metric-value">{m.v}</div>
              <div className="metric-trend">{m.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-row">
        <div><h2 className="section-heading">The league in graphics.</h2><p className="section-sub">Where goals come from, and who creates them.</p></div>
      </div>
      <div className="grid-3">
        <div className="panel pad"><h3 className="panel-title" style={{ marginBottom: 16 }}>Top scorers</h3><BarList rows={scorers.map((p) => ({ label: p.short, value: p.stats.goals, img: p.crest }))} /></div>
        <div className="panel pad"><h3 className="panel-title" style={{ marginBottom: 16 }}>Top creators</h3><BarList color="#6bc4f5" rows={creators.map((p) => ({ label: p.short, value: p.stats.assists, img: p.crest }))} /></div>
        <div className="panel pad"><h3 className="panel-title" style={{ marginBottom: 16 }}>Goals by club</h3><BarList color="#f5c46b" rows={teamGoals} /></div>
      </div>
      <div className="grid-2" style={{ marginTop: 18 }}>
        <div className="panel pad"><h3 className="panel-title" style={{ marginBottom: 6 }}>Rated players by position</h3><p className="panel-kicker" style={{ marginBottom: 14 }}>Everyone with at least one appearance</p><Donut data={posCount} /></div>
        <div className="panel pad">
          <h3 className="panel-title" style={{ marginBottom: 14 }}>Title race</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {std.slice(0, 5).map((s) => (
              <div key={s.teamId} style={{ display: 'grid', gridTemplateColumns: '22px 24px 1fr 90px 34px', gap: 10, alignItems: 'center', fontSize: 13 }}>
                <span className="rank">{s.rank}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="crest" src={TEAMS.find((t) => t.id === s.teamId)?.crest} alt="" />
                <span>{s.team}</span>
                <div className="scorebar" style={{ marginTop: 0, height: 7 }}><i style={{ width: `${(s.points / (s.played * 3 || 1)) * 100}%` }} /></div>
                <b className="num">{s.points}</b>
              </div>
            ))}
          </div>
          <button className="text-btn" style={{ marginTop: 16, marginLeft: 0 }} onClick={() => go('table')}>Full table <ArrowUpRight size={14} /></button>
        </div>
      </div>

      <div className="section-row">
        <div><h2 className="section-heading">Leaderboard, with context.</h2><p className="section-sub">Top performers across {LEAGUE_NAME[league]} · season to date</p></div>
        <div className="filter-row"><button className="pill" onClick={() => go('leaderboard')}>Full view →</button></div>
      </div>
      <Leaderboard rows={all.slice(0, 8)} onOpen={onOpen} />
    </>
  );
}

function LeaderboardView({ league, onOpen, query }: { league: League; onOpen: (p: Scored) => void; query: string }) {
  const [pos, setPos] = useState<Pos | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'goals' | 'assists' | 'context' | 'apps'>('score');
  const [limit, setLimit] = useState(50);

  const allPlayersInLeague = useMemo(() => leaguePlayers(league), [league]);
  const posCounts = useMemo(() => ({
    ALL: allPlayersInLeague.length,
    FWD: allPlayersInLeague.filter((p) => p.pos === 'FWD').length,
    MID: allPlayersInLeague.filter((p) => p.pos === 'MID').length,
    DEF: allPlayersInLeague.filter((p) => p.pos === 'DEF').length,
    GK: allPlayersInLeague.filter((p) => p.pos === 'GK').length,
  }), [allPlayersInLeague]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = leaguePlayers(league, pos).filter((p) => !q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q));

    return filtered.sort((a, b) => {
      if (sortBy === 'goals') return b.stats.goals - a.stats.goals;
      if (sortBy === 'assists') return b.stats.assists - a.stats.assists;
      if (sortBy === 'context') return b.context - a.context;
      if (sortBy === 'apps') return b.stats.apps - a.stats.apps;
      return b.score - a.score;
    });
  }, [league, pos, query, sortBy]);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{LEAGUE_NAME[league]} · {SEASON}</div>
          <h1>The <em>leaderboard.</em></h1>
        </div>
        <p>Every player with minutes this season, scored against their own position — a keeper is never compared to a striker.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="filter-row">
          {(['ALL', 'FWD', 'MID', 'DEF', 'GK'] as const).map((k) => (
            <button
              key={k}
              className={`pill ${pos === k ? 'active' : ''}`}
              onClick={() => { setPos(k); setLimit(50); }}
            >
              <span>{k === 'ALL' ? 'All positions' : k}</span>
              <span className="ml-1.5 opacity-60 text-[10px] font-mono">({posCounts[k]})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 whitespace-nowrap">
            <ArrowUpDown size={12} className="text-emerald-400" /> Sort by:
          </span>
          <select
            className="bg-black/70 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-white/40 cursor-pointer shadow-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="score">BYRX Rating (High to Low)</option>
            <option value="goals">Goals Scored</option>
            <option value="assists">Assists Provided</option>
            <option value="context">Opponent Difficulty (Context)</option>
            <option value="apps">Appearances Played</option>
          </select>
        </div>
      </div>

      <Leaderboard rows={rows.slice(0, limit)} onOpen={onOpen} />
      {limit < rows.length && (
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button className="pill active" onClick={() => setLimit(limit + 50)}>
            Show 50 more ({rows.length - limit} left)
          </button>
        </div>
      )}
    </>
  );
}

function Totw({ league, onOpen }: { league: League; onOpen: (p: Scored) => void }) {
  const xi = teamOfTheWeek(league);
  const posLabels = ['GK', 'LB', 'CB', 'CB', 'RB', 'LCM', 'CM', 'RCM', 'LW', 'ST', 'RW'];
  const rows: { y: number; xs: number[] }[] = [
    { y: 88, xs: [50] },
    { y: 68, xs: [14, 38, 62, 86] },
    { y: 44, xs: [24, 50, 76] },
    { y: 20, xs: [20, 50, 80] },
  ];
  let k = 0;
  const placed = rows.flatMap((r) => r.xs.map((x) => ({ x, y: r.y, p: xi[k], slot: posLabels[k++] })));

  const avgRating = xi.length > 0
    ? (xi.reduce((acc, curr) => acc + curr.score, 0) / xi.length).toFixed(2)
    : '0.00';

  const captainId = [...xi].sort((a, b) => b.score - a.score)[0]?.id;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{LEAGUE_NAME[league]} · BEST ELEVEN</div>
          <h1>Team of <em>the season.</em></h1>
        </div>
        <p>The highest BYRX score at every position, tactical 4-3-3 formation. Click any player for full analytical breakdown.</p>
      </div>

      {/* Tactical Pitch Header Info Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-xl max-w-[580px] mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Shield size={16} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Formation</div>
            <div className="text-xs font-display font-black text-white">4-3-3 Attack Vector</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">XI Squad Average</div>
            <div className="text-sm font-display font-black text-emerald-400">{avgRating}★ / 10</div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      <div className="pitch">
        <svg className="lines" viewBox="0 0 68 92" preserveAspectRatio="none" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth=".35">
          <rect x="2" y="2" width="64" height="88" /><line x1="2" y1="46" x2="66" y2="46" /><circle cx="34" cy="46" r="8" />
          <rect x="14" y="2" width="40" height="15" /><rect x="14" y="75" width="40" height="15" /><rect x="25" y="2" width="18" height="6" /><rect x="25" y="84" width="18" height="6" />
        </svg>
        {placed.map(({ x, y, p, slot }) => p && (
          <div key={p.id} className="pitch-player" style={{ left: `${x}%`, top: `${y}%` }} onClick={() => onOpen(p)}>
            <div className="pitch-avatar-wrap">
              <Avatar p={p} cls="pitch-img" />
              {p.crest && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.crest} alt="" className="pitch-crest" />
              )}
              {p.id === captainId && (
                <div className="pitch-captain" title="Squad Captain">C</div>
              )}
            </div>
            <div className="nm">{p.short}</div>
            <span className="sc">
              <span className="opacity-70 text-[9px] mr-0.5">{slot}</span>
              {p.score.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Compare({ league }: { league: League }) {
  const pool = useMemo(() => leaguePlayers(league), [league]);
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const A = pool[a] ?? pool[0], B = pool[b] ?? pool[1];
  const rows: [string, (p: Scored) => number][] = [
    ['BYRX Score', (p) => p.score],
    ['Goals', (p) => p.stats.goals],
    ['Assists', (p) => p.stats.assists],
    ['Shots on Target', (p) => p.stats.sot],
    ['Total Shots', (p) => p.stats.shots],
    ['Fouls Suffered', (p) => p.stats.fa],
    ['Appearances', (p) => p.stats.apps],
    ['Context Factor', (p) => p.context],
  ];
  const opts = pool.slice(0, 200);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">HEAD TO HEAD COMBAT MATRIX</div>
          <h1>Compare <em>players.</em></h1>
        </div>
        <p>Pick any two players from the top 200. The radar & statistical delta meters illustrate comparative dominance.</p>
      </div>

      {/* VS Head-to-Head Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center mb-6 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Player A Selector Card */}
        <div className="md:col-span-5 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <Avatar p={A} cls="w-12 h-12 rounded-full border-2 border-[#00ff87] object-cover shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-[#00ff87] font-bold uppercase tracking-wider">Player 01</span>
              <span className="text-xs font-mono font-bold text-[#00ff87] bg-[#00ff87]/10 px-2 py-0.5 rounded-full">{A.score.toFixed(2)}★</span>
            </div>
            <select
              className="w-full bg-black/80 border border-white/15 rounded-lg px-2.5 py-1 text-xs font-semibold text-white outline-none cursor-pointer"
              value={a}
              onChange={(e) => setA(+e.target.value)}
            >
              {opts.map((p, i) => <option key={p.id} value={i}>{p.name} ({p.team})</option>)}
            </select>
          </div>
        </div>

        {/* Central VS Badge */}
        <div className="md:col-span-1 flex justify-center py-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00ff87] to-[#38bdf8] p-0.5 shadow-[0_0_20px_rgba(0,255,135,0.4)]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-display font-black text-xs text-white tracking-widest">
              VS
            </div>
          </div>
        </div>

        {/* Player B Selector Card */}
        <div className="md:col-span-5 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <Avatar p={B} cls="w-12 h-12 rounded-full border-2 border-[#f57b7b] object-cover shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-[#f57b7b] font-bold uppercase tracking-wider">Player 02</span>
              <span className="text-xs font-mono font-bold text-[#f57b7b] bg-[#f57b7b]/10 px-2 py-0.5 rounded-full">{B.score.toFixed(2)}★</span>
            </div>
            <select
              className="w-full bg-black/80 border border-white/15 rounded-lg px-2.5 py-1 text-xs font-semibold text-white outline-none cursor-pointer"
              value={b}
              onChange={(e) => setB(+e.target.value)}
            >
              {opts.map((p, i) => <option key={p.id} value={i}>{p.name} ({p.team})</option>)}
            </select>
          </div>
        </div>
      </div>

      {A && B && (
        <div className="grid-2">
          <div className="panel pad">
            <Radar players={[A, B]} colors={['#00ff87', '#f57b7b']} />
            <div className="legend" style={{ justifyContent: 'center' }}>
              <span className="flex items-center gap-1.5"><i style={{ background: '#00ff87' }} />{A.name} ({A.score.toFixed(1)})</span>
              <span className="flex items-center gap-1.5"><i style={{ background: '#f57b7b' }} />{B.name} ({B.score.toFixed(1)})</span>
            </div>
          </div>
          <div className="panel pad">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-3">Stat Delta Breakdown</div>
            <div style={{ display: 'grid', gap: 14 }}>
              {rows.map(([label, f]) => {
                const x = f(A);
                const y = f(B);
                const total = Math.max(x + y, 0.001);
                const pctA = Math.round((x / total) * 100);
                const pctB = 100 - pctA;
                const aWins = x > y;
                const bWins = y > x;

                return (
                  <div key={label} className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                      <b className={`text-sm ${aWins ? 'text-[#00ff87] font-extrabold' : 'text-slate-300'}`}>
                        {typeof x === 'number' && !Number.isInteger(x) ? x.toFixed(2) : x}
                      </b>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-sans font-bold">{label}</span>
                      <b className={`text-sm ${bWins ? 'text-[#f57b7b] font-extrabold' : 'text-slate-300'}`}>
                        {typeof y === 'number' && !Number.isInteger(y) ? y.toFixed(2) : y}
                      </b>
                    </div>
                    {/* Comparative Dual-Tone Balance Bar */}
                    <div className="h-2 w-full rounded-full bg-black/60 overflow-hidden flex">
                      <div style={{ width: `${pctA}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-[#00ff87] transition-all duration-300" />
                      <div style={{ width: `${pctB}%` }} className="h-full bg-gradient-to-l from-rose-600 to-[#f57b7b] transition-all duration-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LeagueTable({ league, onClub }: { league: League; onClub: (id: string) => void }) {
  const std = standingsFor(league);
  const n = std.length;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{LEAGUE_NAME[league]} · {SEASON}</div>
          <h1>League <em>standings.</em></h1>
        </div>
        <p>Live standings from ESPN. Interactive clubs, goal difference indices, and qualification thresholds.</p>
      </div>

      {/* Qualification Threshold Legends */}
      <div className="flex flex-wrap items-center gap-4 mb-4 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff87] shadow-[0_0_8px_rgba(0,255,135,0.8)]" />
          <span>UEFA Champions League (Top 4)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
          <span>Europa League (5-6)</span>
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f57b7b] shadow-[0_0_8px_rgba(245,123,123,0.8)]" />
          <span>Relegation Zone (Bottom 3)</span>
        </span>
      </div>

      <div className="panel" style={{ overflow: 'hidden' }}>
        <div className="lt-row lt-head">
          <span>#</span>
          <span>Club</span>
          <span>P</span>
          <span>W</span>
          <span>D</span>
          <span>L</span>
          <span>GF</span>
          <span>GA</span>
          <span>GD</span>
          <span style={{ textAlign: 'right', paddingRight: 6 }}>Pts</span>
        </div>
        {std.map((s) => {
          const zone = s.rank <= 4 ? 'zone-ucl' : s.rank <= 6 ? 'zone-uel' : s.rank > n - 3 ? 'zone-rel' : '';
          const gdSign = s.gd > 0 ? `+${s.gd}` : `${s.gd}`;
          const isPositiveGd = s.gd > 0;
          const isNegativeGd = s.gd < 0;

          return (
            <div key={s.teamId} className={`lt-row ${zone} group`} onClick={() => onClub(s.teamId)}>
              <span className={`rank font-bold ${s.rank <= 4 ? 'text-[#00ff87]' : s.rank <= 6 ? 'text-[#38bdf8]' : s.rank > n - 3 ? 'text-[#f57b7b]' : ''}`}>
                {s.rank}
              </span>
              <span className="club-cell" style={{ color: '#e8efe6', fontWeight: 600 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="crest" src={TEAMS.find((t) => t.id === s.teamId)?.crest} alt="" />
                <span className="group-hover:text-white transition-colors">{s.team}</span>
              </span>
              <span className="num">{s.played}</span>
              <span className="num">{s.wins}</span>
              <span className="num">{s.draws}</span>
              <span className="num">{s.losses}</span>
              <span className="num">{s.gf}</span>
              <span className="num">{s.ga}</span>
              <span className={`num font-semibold text-xs ${isPositiveGd ? 'text-[#00ff87]' : isNegativeGd ? 'text-[#f57b7b]' : 'text-slate-400'}`}>
                {gdSign}
              </span>
              <div>
                <b className="num" style={{ color: '#00ff87', fontSize: 14 }}>{s.points}</b>
                <div className="scorebar">
                  <i style={{ width: `${(s.points / (s.played * 3 || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Clubs({ league, openClub, onOpen, selected }: { league: League; openClub: (id: string | null) => void; onOpen: (p: Scored) => void; selected: string | null }) {
  const teams = teamsFor(league);
  const team = TEAMS.find((t) => t.id === selected);
  if (team && team.league === league) {
    const squad = squadOf(team.id);
    const st = standingsFor(league).find((s) => s.teamId === team.id);
    return (
      <>
        <button className="pill" onClick={() => openClub(null)} style={{ marginBottom: 18 }}>← All clubs</button>
        <div className="page-heading">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={team.crest} alt="" style={{ width: 84, height: 84, objectFit: 'contain' }} />
            <div><div className="eyebrow">{LEAGUE_NAME[league]} · {squad.length} players · 2026/27 squad (ESPN)</div><h1 style={{ fontSize: 46 }}>{team.name}</h1></div>
          </div>
          {st && <p>{st.rank}{['st', 'nd', 'rd'][st.rank - 1] || 'th'} · {st.points} pts · W{st.wins} D{st.draws} L{st.losses} · GD {st.gd > 0 ? '+' : ''}{st.gd}</p>}
        </div>
        {(['GK', 'DEF', 'MID', 'FWD'] as Pos[]).map((pos) => (
          <div key={pos} style={{ marginBottom: 26 }}>
            <div className="eyebrow" style={{ color: POS_COL[pos], marginBottom: 12 }}>{{ GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', FWD: 'Forwards' }[pos]}</div>
            <div className="grid-3">
              {squad.filter((p) => p.pos === pos).map((p) => (
                <button key={p.id} className="club-card" onClick={() => onOpen(p)} style={{ ['--c' as string]: POS_COL[pos] }}>
                  <Avatar p={p} cls="row-avatar" />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <b style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</b>
                    <span className="player-sub">#{p.jersey || '–'} · {p.nationality || '—'}{p.age ? ` · ${p.age}y` : ''}</span>
                  </div>
                  <span className="score-cell" style={{ fontSize: 14, position: 'relative', zIndex: 1 }}>{p.stats.apps ? p.score.toFixed(1) : '–'}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }
  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">{teams.length} clubs · {ALL_PLAYERS.filter((p) => p.league === league).length} players</div><h1>Clubs &amp; <em>squads.</em></h1></div>
        <p>Official 2026/27 squads pulled from ESPN rosters for every top-flight club. Pick one to see its full squad.</p>
      </div>
      <div className="grid-3">
        {teams.map((t) => (
          <button key={t.id} className="club-card" style={{ ['--c' as string]: t.color }} onClick={() => openClub(t.id)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.crest} alt="" />
            <div><b>{t.name}</b><div className="player-sub">{squadOf(t.id).length} players</div></div>
          </button>
        ))}
      </div>
    </>
  );
}

function Method() {
  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">methodology</div><h1>Inspect <em>the math.</em></h1></div>
        <p>Every number is traceable to ESPN&apos;s season stats. Nothing is hand-typed.</p>
      </div>
      <div className="grid-2">
        <div className="panel pad">
          <h3 className="panel-title" style={{ marginBottom: 14 }}>Per-appearance value (by position)</h3>
          <pre className="formula">{`FWD = 5·G + 3·A + .5·SOT + .15·SHOTS + .05·FA − disc
MID = 5.5·G + 4·A + .5·SOT + .2·SHOTS + .1·FA − .03·FC − disc
DEF = 7·G + 4.5·A + .4·SOT + .08·FA − .04·FC − disc − .8·(team GA/game)
GK  = .5·SAVES − 1.2·GA  + 6·(save %)
disc = .4·YC + 2·RC          (all ÷ appearances)`}</pre>
        </div>
        <div className="panel pad">
          <h3 className="panel-title" style={{ marginBottom: 14 }}>From value to score</h3>
          <pre className="formula">{`1. Percentile rank within position, per league
2. Base score = 5.0 + percentile × 4.9
3. Confidence = min(1, appearances / 4)
4. Score = 6 + (base − 6)·confidence + club-strength lift
5. Context = 1.00–1.25× from league-table position`}</pre>
          <p style={{ color: '#8b9b8e', fontSize: 13, marginTop: 14, lineHeight: 1.6 }}>Pipeline: <span className="mono" style={{ color: '#d6f77b' }}>node scripts/fetch_espn.mjs</span> rebuilds the database from ESPN rosters, stats and standings for all 40 clubs.</p>
        </div>
      </div>
    </>
  );
}

function PlayerModal({ p, onClose }: { p: Scored; onClose: () => void }) {
  const s = p.stats;
  const tiles: [string, string | number][] = p.pos === 'GK'
    ? [['Apps', s.apps], ['Saves', s.saves], ['Shots faced', s.shotsFaced], ['Conceded', s.ga], ['Yellow', s.yc], ['Red', s.rc]]
    : [['Apps', s.apps], ['Goals', s.goals], ['Assists', s.assists], ['Shots', s.shots], ['On target', s.sot], ['Fouls won', s.fa], ['Fouls', s.fc], ['Yellow', s.yc], ['Red', s.rc], ['Offsides', s.offsides]];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar p={p} cls="hero-avatar" />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="eyebrow">{p.team} · #{p.jersey || '–'} · {p.pos}</div>
            <h2 style={{ fontSize: 38, letterSpacing: '-.03em', margin: '6px 0' }}>{p.name}</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#8b9b8e', fontSize: 13, flexWrap: 'wrap' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.flag && <img src={p.flag} alt="" style={{ width: 22, borderRadius: 3 }} />}{p.nationality}{p.age ? ` · ${p.age} yrs` : ''}{p.height ? ` · ${p.height}` : ''}
            </div>
          </div>
          <div className="hero-rating" style={{ textAlign: 'right' }}>{p.stats.apps ? p.score.toFixed(2) : '—'}<small>/10</small><div style={{ fontSize: 11, color: '#8b9b8e', fontWeight: 400, marginTop: 4 }}>{p.rank ? `#${p.rank} in ${LEAGUE_NAME[p.league]}` : 'unrated'}</div></div>
        </div>
        <div className="stat-tiles" style={{ marginTop: 26 }}>{tiles.map(([l, v]) => <div className="tile" key={l}><span>{l}</span><b>{v}</b></div>)}</div>
        <div className="grid-2" style={{ marginTop: 22, alignItems: 'center' }}>
          <Radar players={[p]} colors={['#d6f77b']} />
          <div style={{ color: '#8b9b8e', fontSize: 13, lineHeight: 1.7 }}>
            Radar shows league percentile (0–100) across goals, creation, shooting, duels won, discipline and availability. Club context lift: <b style={{ color: '#d6f77b' }}>{p.context.toFixed(2)}×</b>.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Shell ───────────── */

export default function Dashboard() {
  const [view, setView] = useState<View>('overview');
  const [league, setLeague] = useState<League>('PL');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [player, setPlayer] = useState<Scored | null>(null);
  const [club, setClub] = useState<string | null>(null);
  const ls = leagueStats(league);

  const go = (v: View) => { setView(v); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goClub = (id: string | null) => { setClub(id); setView('clubs'); window.scrollTo({ top: 0 }); };
  const onSearch = (q: string) => { setQuery(q); if (q && view !== 'leaderboard') setView('leaderboard'); };

  return (
    <div className={`app-shell theme-${league.toLowerCase()}`}>
      <CinematicLeagueAtmosphere league={league} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div
            className="brand-mark font-display relative overflow-hidden group shadow-lg flex items-center justify-center p-1.5"
            style={{
              background: league === 'PL'
                ? 'linear-gradient(135deg, #38003c 0%, #e90052 100%)'
                : 'linear-gradient(135deg, #1f0206 0%, #ea0029 100%)',
              boxShadow: league === 'PL'
                ? '0 0 24px rgba(233, 0, 82, 0.6)'
                : '0 0 24px rgba(234, 0, 41, 0.6)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LEAGUE_LOGOS[league].dark}
              alt={LEAGUE_LOGOS[league].name}
              className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="brand-copy">
            <strong className="font-display">football insights</strong>
            <span>{LEAGUE_LOGOS[league].name}</span>
          </div>
        </div>
        <div className="nav-label">Workspace</div>
        <nav className="nav-list">
          {NAV.map((n) => <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => { setClub(null); go(n.id); }}>{n.icon}<span>{n.label}</span></button>)}
        </nav>
        <div className="nav-label" style={{ marginTop: 28 }}>Methodology</div>
        <nav className="nav-list"><button className={`nav-item ${view === 'method' ? 'active' : ''}`} onClick={() => go('method')}><BookOpen size={18} /><span>Inspect the math</span></button></nav>
        <div className="sidebar-bottom">
          <div className="live-chip"><i className="live-dot" /> Live ESPN · MW {String(ls.played).padStart(2, '0')}</div>
          <div className="sidebar-footnote">{ALL_PLAYERS.length.toLocaleString()} players · {TEAMS.length} clubs · {SEASON}. Position-adjusted. Opponent aware.</div>
        </div>
      </aside>
      <div className="main">
        <div className="mobile-topbar">
          <div className="brand" style={{ padding: 0 }}>
            <div
              className="brand-mark font-display flex items-center justify-center p-1"
              style={{
                background: league === 'PL' ? 'linear-gradient(135deg, #38003c, #e90052)' : 'linear-gradient(135deg, #1f0206, #ea0029)',
                boxShadow: league === 'PL' ? '0 0 16px rgba(233,0,82,0.5)' : '0 0 16px rgba(234,0,41,0.5)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LEAGUE_LOGOS[league].dark} alt={LEAGUE_LOGOS[league].name} className="w-6 h-6 object-contain" />
            </div>
            <div className="brand-copy"><strong className="font-display">football insights</strong></div>
          </div>
          <button className="seg" style={{ padding: 8, color: '#e8efe6' }} onClick={() => setOpen(!open)} aria-label="Menu"><Menu size={18} /></button>
        </div>
        <header className="topbar">
          <div className="breadcrumb font-mono text-xs">{SEASON} season <span style={{ color: '#4f5e51' }}> / </span> <b>{NAV.find((n) => n.id === view)?.label ?? 'Inspect the math'}</b></div>
          <div className="top-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, color: '#68766b', pointerEvents: 'none' }} />
              <input
                className="top-input font-mono"
                placeholder="Search players or clubs..."
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                aria-label="Search players"
              />
              {query ? (
                <button
                  onClick={() => onSearch('')}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              ) : (
                <span className="kbd-hint hidden sm:inline">⌘K</span>
              )}
            </div>
            {/* Dynamic League Switcher with Noticeable Official Logos */}
            <div className="flex items-center p-1 bg-black/75 backdrop-blur-xl border border-white/15 rounded-2xl gap-1.5 shadow-2xl">
              {(['PL', 'LALIGA'] as League[]).map((l) => {
                const isActive = league === l;
                const isThisPL = l === 'PL';
                const meta = LEAGUE_LOGOS[l];
                return (
                  <button
                    key={l}
                    onClick={() => { setLeague(l); setClub(null); }}
                    className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-display font-extrabold transition-all duration-300 group ${
                      isActive
                        ? isThisPL
                          ? 'bg-gradient-to-r from-[#e90052] via-[#b80041] to-[#38003c] text-white shadow-[0_0_24px_rgba(233,0,82,0.65)] border border-white/40 scale-[1.02]'
                          : 'bg-gradient-to-r from-[#ea0029] via-[#d60025] to-[#ff5722] text-white shadow-[0_0_24px_rgba(234,0,41,0.65)] border border-white/40 scale-[1.02]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {/* Official League Logo: Crowned Lion extra noticeable */}
                    <div
                      className={`relative flex items-center justify-center rounded-lg transition-transform duration-300 ${
                        isActive
                          ? isThisPL
                            ? 'w-7 h-7 p-0.5 bg-white/15 ring-2 ring-white/50 shadow-[0_0_14px_rgba(255,255,255,0.7)]'
                            : 'w-6 h-6 p-0.5 bg-white/10 ring-1 ring-white/30 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                          : 'w-6 h-6 opacity-70 group-hover:opacity-100 group-hover:scale-110'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={meta.dark}
                        alt={meta.name}
                        className={`object-contain transition-all ${
                          isThisPL
                            ? 'w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] filter brightness-110'
                            : 'w-full h-full drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                        }`}
                      />
                    </div>

                    <span className="tracking-tight whitespace-nowrap font-bold">
                      {meta.name}
                    </span>

                    {/* Active live indicator dot */}
                    {isActive && (
                      <span className="relative flex h-2 w-2 ml-0.5">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isThisPL ? 'bg-[#00ff87]' : 'bg-[#ffea00]'
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            isThisPL ? 'bg-[#00ff87]' : 'bg-[#ffea00]'
                          }`}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </header>
        <main className="content">
          {view === 'overview' && <Overview league={league} onOpen={setPlayer} go={go} />}
          {view === 'predict' && <MatchPredictorView league={league} />}
          {view === 'leaderboard' && <LeaderboardView league={league} onOpen={setPlayer} query={query} />}
          {view === 'totw' && <Totw league={league} onOpen={setPlayer} />}
          {view === 'compare' && <Compare league={league} />}
          {view === 'table' && <LeagueTable league={league} onClub={goClub} />}
          {view === 'clubs' && <Clubs league={league} openClub={setClub} onOpen={setPlayer} selected={club} />}
          {view === 'method' && <Method />}
          <footer className="footer"><span>BYRX72 / football insights</span><span>Data: ESPN · {SEASON} · synced {new Date(GENERATED_AT).toLocaleDateString()}</span></footer>
        </main>
      </div>
      {player && <RichPlayerProfileModal player={player} onClose={() => setPlayer(null)} league={league} />}
    </div>
  );
}
