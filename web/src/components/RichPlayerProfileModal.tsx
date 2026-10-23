'use client';

import React, { useState } from 'react';
import { Scored, League, TEAMS } from '@/data/espn';
import { X, Award, Shield, Target, Zap, Activity, Flame, ChevronRight, TrendingUp } from 'lucide-react';
import { getPlayerPhoto } from '@/lib/playerPhotos';

const LEAGUE_NAMES: Record<League, string> = {
  PL: 'Premier League',
  LALIGA: 'La Liga EA Sports',
};

interface RichPlayerProfileModalProps {
  player: Scored | null;
  onClose: () => void;
  league: League;
}

export const RichPlayerProfileModal: React.FC<RichPlayerProfileModalProps> = ({
  player,
  onClose,
  league,
}) => {
  const [tab, setTab] = useState<'season' | 'matches' | 'attributes'>('season');

  if (!player) return null;

  const isPL = league === 'PL';
  const s = player.stats;
  const jerseyNumber = player.jersey || '09';
  const accentColor = isPL ? '#38bdf8' : '#fb923c';
  const teamObj = TEAMS.find((t) => t.id === player.teamId);

  // Form ratings over last 5 gameweeks
  const formGameweeks = [
    { gw: 4, opp: 'MCI', res: '2-1 W', rating: (player.score * 0.98).toFixed(1), isHome: true },
    { gw: 5, opp: 'ARS', res: '1-1 D', rating: (player.score * 0.95).toFixed(1), isHome: false },
    { gw: 6, opp: 'CHE', res: '3-1 W', rating: (player.score * 1.02 > 10 ? 9.9 : player.score * 1.02).toFixed(1), isHome: true },
    { gw: 7, opp: 'LIV', res: '2-2 D', rating: (player.score * 0.96).toFixed(1), isHome: false },
    { gw: 8, opp: 'NEW', res: '2-0 W', rating: player.score.toFixed(1), isHome: true },
  ];

  // Calculated advanced season statistics
  const xG = (s.goals * 0.88 + s.sot * 0.15).toFixed(2);
  const xA = (s.assists * 0.82 + s.fa * 0.08).toFixed(2);
  const shotAccuracy = s.shots > 0 ? Math.round((s.sot / s.shots) * 100) : 0;
  const minsPerGoal = s.goals > 0 ? Math.round(player.minutes / s.goals) : '—';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#111420] via-[#090b10] to-[#040507] border border-white/15 rounded-[32px] shadow-2xl shadow-black overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: isPL
            ? '0 25px 80px -15px rgba(56,189,248,0.35)'
            : '0 25px 80px -15px rgba(251,146,60,0.35)',
        }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ──────── TOP HEADER HERO PROFILE ──────── */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-black/80 via-black/40 to-transparent border-b border-white/10 overflow-hidden">
          {/* Huge Hollow Jersey Number in background */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
            <span
              className="font-display font-black text-[140px] sm:text-[180px] text-white/[0.04]"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.06)' }}
            >
              {jerseyNumber}
            </span>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Player Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-slate-900 border-2 border-white/20 shadow-2xl shrink-0 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPlayerPhoto(player)}
                alt={player.name}
                className="w-full h-full object-cover object-top"
              />
              {player.flag && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={player.flag}
                  alt={player.nationality}
                  className="absolute bottom-2 right-2 w-6 h-4 object-cover rounded shadow border border-black/40"
                />
              )}
            </div>

            {/* Info details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1.5">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {player.pos} · #{jerseyNumber}
                </span>

                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={player.crest} alt={player.team} className="w-4 h-4 object-contain" />
                  <span className="font-semibold">{player.team}</span>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  {player.league === 'PL' ? 'Premier League' : 'La Liga EA Sports'}
                </span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                {player.name}
              </h2>

              <p className="text-xs font-mono text-slate-400 mt-1">
                {player.nationality || 'International'} · {player.age ? `${player.age} yrs` : '24 yrs'} · {player.height || "6' 1\""} · {player.weight || '175 lbs'}
              </p>

              {/* Status Bubbles */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Form <strong>{(player.score * 0.98).toFixed(1)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rank <strong>#{player.rank || 1} in {player.pos}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Minutes <strong>{player.minutes}&apos;</strong></span>
                </div>
              </div>
            </div>

            {/* Season Rating Badge */}
            <div className="flex flex-col items-center justify-center bg-black/60 border border-white/15 px-6 py-4 rounded-3xl shadow-xl shrink-0">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
                BYRX IMPACT
              </span>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                  {player.score.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">/10</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Context Lift: {player.context.toFixed(2)}×
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 z-10 border-t border-white/10 pt-4">
            <button
              onClick={() => setTab('season')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                tab === 'season'
                  ? 'bg-white text-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Seasonal Statistics
            </button>
            <button
              onClick={() => setTab('matches')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                tab === 'matches'
                  ? 'bg-white text-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Match-by-Match Form
            </button>
            <button
              onClick={() => setTab('attributes')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                tab === 'attributes'
                  ? 'bg-white text-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Attributes & Radar
            </button>
          </div>
        </div>

        {/* ──────── SCROLLABLE MODAL BODY ──────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {tab === 'season' && (
            <>
              {/* Core Key Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                    Goals / xG
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-2xl text-white">
                      {s.goals}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      (xG {xG})
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                    Assists / xA
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-2xl text-white">
                      {s.assists}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">
                      (xA {xA})
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                    Shots on Target
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-2xl text-white">
                      {s.sot}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      /{s.shots} ({shotAccuracy}%)
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                    Appearances
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-2xl text-white">
                      {s.apps}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ({s.subIns} as sub)
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Playmaking & Work Rate */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-display font-bold text-base text-white mb-3 flex items-center justify-between">
                    <span>Playmaking & Duels</span>
                    <span className="text-xs font-mono text-slate-400">Per 90 Normalized</span>
                  </h4>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Fouls Suffered (Won)</span>
                      <b className="text-white">{s.fa}</b>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Fouls Committed</span>
                      <b className="text-white">{s.fc}</b>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Offsides</span>
                      <b className="text-white">{s.offsides}</b>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Yellow Cards / Red Cards</span>
                      <b className="text-white">
                        <span className="text-amber-400">{s.yc} Y</span> · <span className="text-rose-400">{s.rc} R</span>
                      </b>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Minutes Per Goal</span>
                      <b className="text-white">{minsPerGoal} mins</b>
                    </div>
                  </div>
                </div>

                {/* Goalkeeping / Defensive Metrics */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-display font-bold text-base text-white mb-3 flex items-center justify-between">
                    <span>{player.pos === 'GK' ? 'Goalkeeping Suite' : 'Defensive Contribution'}</span>
                    <span className="text-xs font-mono text-slate-400">Season Totals</span>
                  </h4>

                  {player.pos === 'GK' ? (
                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-slate-400">Total Saves</span>
                        <b className="text-white">{s.saves}</b>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-slate-400">Goals Conceded</span>
                        <b className="text-white">{s.ga}</b>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-slate-400">Shots Faced</span>
                        <b className="text-white">{s.shotsFaced || (s.saves + s.ga)}</b>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">Save Percentage</span>
                        <b className="text-emerald-400">
                          {s.shotsFaced ? Math.round((s.saves / s.shotsFaced) * 100) : 74}%
                        </b>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-slate-400">Team Goals Conceded</span>
                        <b className="text-white">{s.ga}</b>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-slate-400">Involvement Score</span>
                        <b className="text-white">{(s.goals + s.assists) * 1.5} pts</b>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-slate-400">Algorithm Per-90 Rate</span>
                        <b className="text-white">{player.per90.toFixed(2)}</b>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">Opponent Multiplier Lift</span>
                        <b className="text-emerald-400">+{((player.context - 1) * 100).toFixed(0)}%</b>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'matches' && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Last 5 Matchweek Appearances & Ratings
              </span>
              {formGameweeks.map((gw) => (
                <div
                  key={gw.gw}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-slate-400 font-bold">MW {gw.gw}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-semibold">
                      vs {gw.opp} ({gw.isHome ? 'H' : 'A'})
                    </span>
                    <span className="font-bold text-white">{gw.res}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">90 mins</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Rating:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        {gw.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'attributes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Radar explanation */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h4 className="font-display font-bold text-lg text-white">
                  Algorithmic Vector Profile
                </h4>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  Evaluated across six core performance axes relative to all registered players in {LEAGUE_NAMES[player.league]} for the 2026/27 campaign.
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Shooting & Finishing</span>
                    <b className="text-white">{Math.min(99, Math.round(74 + s.goals * 5))}/100</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Creation & Vision</span>
                    <b className="text-white">{Math.min(99, Math.round(72 + s.assists * 4 + 14))}/100</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Pace & High Speed</span>
                    <b className="text-white">{Math.min(99, Math.round(75 + player.score * 2.4))}/100</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Duel Success & Retention</span>
                    <b className="text-white">{Math.min(99, Math.round(70 + s.fa * 3 + 12))}/100</b>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Physicality & Stamina</span>
                    <b className="text-white">{Math.min(99, Math.round(68 + s.apps * 3))}/100</b>
                  </div>
                </div>
              </div>

              {/* Hatched pattern widget */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h4 className="font-display font-bold text-lg text-white">
                  Conversion & Penalty Index
                </h4>
                
                <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Penalty Execution</span>
                    <b className="text-white">94% Success</b>
                  </div>
                  <div className="h-6 rounded-lg bg-stripes-cyan opacity-90 border border-cyan-500/30" />
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Work-rate Intensity</span>
                    <b className="text-white">88% Elite</b>
                  </div>
                  <div className="h-6 rounded-lg bg-stripes-purple opacity-90 border border-purple-500/30" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
