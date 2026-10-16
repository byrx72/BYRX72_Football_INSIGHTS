'use client';

import React, { useState, useMemo } from 'react';
import { League, Scored, LEAGUE_LOGOS } from '@/data/espn';
import { ArrowUpRight, Heart, Droplets, Zap, Shield, Flame, Activity, Sparkles } from 'lucide-react';
import { getPlayerPhoto } from '@/lib/playerPhotos';

interface ActivityShowcaseProps {
  league: League;
  featuredPlayer: Scored;
  onOpenPlayer: (player: Scored) => void;
  onExploreMore: () => void;
  availableStars: Scored[];
}

export const ActivityShowcase: React.FC<ActivityShowcaseProps> = ({
  league,
  featuredPlayer,
  onOpenPlayer,
  onExploreMore,
  availableStars,
}) => {
  const isPL = league === 'PL';
  const [activePlayer, setActivePlayer] = useState<Scored>(featuredPlayer);
  const [selectedKit, setSelectedKit] = useState<'home' | 'away' | 'third'>('home');
  const [viewFilter, setViewFilter] = useState<'all' | 'goals' | 'assists'>('all');
  const [hoveredMw, setHoveredMw] = useState<number | null>(null);

  // Update active player if featuredPlayer changes from outside
  React.useEffect(() => {
    setActivePlayer(featuredPlayer);
  }, [featuredPlayer]);

  const accentColor = isPL ? '#e90052' : '#ea0029';
  const accentGlow = isPL
    ? 'rgba(233, 0, 82, 0.35)'
    : 'rgba(234, 0, 41, 0.35)';

  const jerseyNumber = activePlayer.jersey || (isPL ? '09' : '05');

  // Matchday by Matchday Goals & Assists calculation for active player
  const matchdays = useMemo(() => {
    const totalGoals = activePlayer.stats.goals;
    const totalAssists = activePlayer.stats.assists;
    const totalApps = Math.max(activePlayer.stats.apps, 1);
    
    // Opponent schedule for 2026/27 season matchweeks
    const plOpps = ['CHE', 'IPS', 'WHU', 'BRE', 'ARS', 'NEW', 'FUL', 'WOL', 'SOU', 'BOU', 'BHA', 'TOT', 'LIV', 'NFO', 'CRY', 'MUN', 'AVL', 'EVE', 'LEI'];
    const laligaOpps = ['VAL', 'ATH', 'RAY', 'VIL', 'GIR', 'GET', 'OSA', 'ALA', 'SEV', 'RMA', 'ESP', 'RSO', 'BET', 'LEG', 'MLL', 'ATM', 'CEL', 'LPA', 'VLL'];
    const opps = isPL ? plOpps : laligaOpps;

    const list = [];
    let remainingG = totalGoals;
    let remainingA = totalAssists;

    // Played matchdays (MW 1 to MW 8)
    for (let mw = 1; mw <= 8; mw++) {
      const opp = opps[(mw - 1) % opps.length];
      const isHome = mw % 2 === 1;
      
      let g = 0;
      let a = 0;
      if (mw <= totalApps) {
        if (remainingG > 0 && (mw % 2 === 1 || mw === 2 || remainingG >= (8 - mw + 1))) {
          g = Math.min(remainingG, mw === 2 && totalGoals >= 4 ? 2 : 1);
          remainingG -= g;
        }
        if (remainingA > 0 && (mw % 3 === 0 || remainingA >= (8 - mw + 1))) {
          a = Math.min(remainingA, 1);
          remainingA -= a;
        }
      }

      // Height scaled for bar chart
      const gVal = g * 35;
      const aVal = a * 25;
      const baseHeight = 16 + (mw <= totalApps ? 18 : 6);
      const totalHeight = Math.min(100, Math.max(18, baseHeight + gVal + aVal));

      list.push({
        mw,
        opp,
        isHome,
        played: true,
        goals: g,
        assists: a,
        rating: (7.2 + g * 1.1 + a * 0.8 + (mw % 3 === 0 ? 0.4 : 0)).toFixed(1),
        height: totalHeight,
        gHeight: Math.min(100, gVal),
        aHeight: Math.min(100, aVal),
      });
    }

    // Projected Matchdays (MW 9 to MW 38)
    const perGamePace = (totalGoals + totalAssists) / totalApps;
    for (let mw = 9; mw <= 38; mw++) {
      const opp = opps[(mw - 1) % opps.length];
      const isHome = mw % 2 === 0;
      const projectedHeight = Math.round(20 + (perGamePace * 18) + Math.sin(mw * 0.8) * 12);
      
      list.push({
        mw,
        opp,
        isHome,
        played: false,
        goals: 0,
        assists: 0,
        rating: '—',
        height: Math.max(14, Math.min(95, projectedHeight)),
        gHeight: 0,
        aHeight: 0,
      });
    }

    return list;
  }, [activePlayer, isPL]);

  // Radar attributes for active player
  const radar = {
    vitesse: Math.min(99, Math.round(75 + (activePlayer.score * 2.4))),
    dribbles: Math.min(98, Math.round(70 + (activePlayer.stats.fa * 3) + 12)),
    physique: Math.min(96, Math.round(68 + (activePlayer.stats.apps * 3))),
    passing: Math.min(98, Math.round(72 + (activePlayer.stats.assists * 4) + 14)),
    shooting: Math.min(99, Math.round(74 + (activePlayer.stats.goals * 5) + 10)),
    impact: Math.min(99, Math.round(activePlayer.score * 10)),
  };

  const radarPoints = [
    { label: '96 Vitesse', val: radar.vitesse, angle: -Math.PI / 2 },
    { label: '87 Dribbles', val: radar.dribbles, angle: -Math.PI / 6 },
    { label: '70 Physique', val: radar.physique, angle: Math.PI / 6 },
    { label: '89 Passing', val: radar.passing, angle: Math.PI / 2 },
    { label: '94 Shooting', val: radar.shooting, angle: (5 * Math.PI) / 6 },
    { label: '98 Impact', val: radar.impact, angle: (7 * Math.PI) / 6 },
  ];

  const cx = 130;
  const cy = 130;
  const maxR = 90;

  const polygonPoints = radarPoints
    .map((p) => {
      const r = (p.val / 100) * maxR;
      const x = cx + r * Math.cos(p.angle);
      const y = cy + r * Math.sin(p.angle);
      return `${x},${y}`;
    })
    .join(' ');

  const activePhoto = getPlayerPhoto(activePlayer);
  const hoveredMatch = matchdays.find((m) => m.mw === hoveredMw);

  return (
    <section className="relative z-10 w-full mb-10">
      {/* Cinematic Performance Hub Banner & Star Player Carousel */}
      <div className="bg-gradient-to-r from-[#0d1017]/95 via-[#121622]/90 to-[#0d1017]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] p-4 sm:p-5 mb-6 shadow-2xl relative overflow-hidden">
        {/* Subtle ambient league glow behind header */}
        <div
          className="absolute -top-16 -left-16 w-56 h-56 rounded-full blur-[80px] pointer-events-none opacity-30"
          style={{ background: isPL ? '#e90052' : '#ea0029' }}
        />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 relative z-10">
          {/* Header Title with Dynamic League Crest & Broadcast Live Status */}
          <div className="flex items-center gap-3.5">
            {/* Dynamic League Badge with pulsating halo (Premier League Lion Noticeable!) */}
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-2xl p-2 shrink-0 border transition-all shadow-xl"
              style={{
                background: isPL
                  ? 'linear-gradient(135deg, #38003c 0%, #e90052 100%)'
                  : 'linear-gradient(135deg, #1f0206 0%, #ea0029 100%)',
                borderColor: isPL ? 'rgba(233, 0, 82, 0.5)' : 'rgba(234, 0, 41, 0.5)',
                boxShadow: isPL
                  ? '0 0 20px rgba(233, 0, 82, 0.6)'
                  : '0 0 20px rgba(234, 0, 41, 0.6)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LEAGUE_LOGOS[league].dark}
                alt={LEAGUE_LOGOS[league].name}
                className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] filter brightness-110"
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-black" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  CINEMATIC PERFORMANCE HUB · {league === 'PL' ? 'PREMIER LEAGUE' : 'LA LIGA EA SPORTS'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live 4K Tracking
                </span>
              </div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                Biometric Intensity & Form Matrix
              </h3>
            </div>
          </div>

        {/* Star Spotlight Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] text-slate-400 font-mono mr-1 hidden sm:inline">Star Spotlight:</span>
          {availableStars.slice(0, 7).map((star) => {
            const isSelected = activePlayer.id === star.id;
            const photo = getPlayerPhoto(star);
            return (
              <button
                key={star.id}
                onClick={() => setActivePlayer(star)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? isPL
                      ? 'bg-[#e90052] text-white shadow-lg shadow-[#e90052]/30 scale-105'
                      : 'bg-[#ea0029] text-white shadow-lg shadow-[#ea0029]/30 scale-105'
                    : 'bg-black/60 text-slate-300 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={star.name}
                  className="w-4 h-4 rounded-full object-cover bg-slate-800"
                />
                <span>{star.short}</span>
              </button>
            );
          })}
        </div>
        </div>
      </div>

      {/* Grid of 4 Cinematic Bento Cards styled after the reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ──────────────── CARD 1: TOP-LEFT PLAYER LIVE INTENSITY CARD (4 cols) ──────────────── */}
        <div
          onClick={() => onOpenPlayer(activePlayer)}
          className="lg:col-span-4 bg-gradient-to-b from-[#0f1118]/90 via-[#0a0c10]/95 to-[#06070a] border border-white/10 rounded-[32px] p-6 relative overflow-hidden group cursor-pointer shadow-2xl transition-all duration-300 hover:border-white/25 flex flex-col justify-between min-h-[440px]"
          style={{
            boxShadow: `0 20px 50px -10px ${accentGlow}`,
          }}
        >
          {/* Ambient inner rim glow */}
          <div
            className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-40 transition-colors ${
              isPL ? 'bg-[#e90052]' : 'bg-[#ea0029]'
            }`}
          />

          {/* Top Status Indicators (Heart rate and water bubbles from reference image) */}
          <div className="flex items-center justify-between z-10 w-full">
            {/* Heart Rate / Intensity Pill */}
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-center shadow-lg group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/80 mb-0.5 animate-pulse" />
              <span className="text-[11px] font-bold text-white tracking-tight leading-none">
                {Math.round(58 + activePlayer.score * 2.2)} bpm
              </span>
            </div>

            {/* Club Crest & League Badge */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePlayer.crest}
                alt={activePlayer.team}
                className="w-5 h-5 object-contain"
              />
              <span className="text-[11px] font-bold text-slate-200">
                {activePlayer.teamShort}
              </span>
            </div>

            {/* Hydration / Speed Metric Pill */}
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-center shadow-lg group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4 text-cyan-400 fill-cyan-400/80 mb-0.5" />
              <span className="text-[11px] font-bold text-white tracking-tight leading-none">
                1.2L
              </span>
            </div>
          </div>

          {/* Giant Hollow Jersey Number in Background */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
            <span
              className="font-display font-black text-[180px] md:text-[220px] text-white/[0.05] tracking-tighter"
              style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.08)',
              }}
            >
              {jerseyNumber}
            </span>
          </div>

          {/* Player Portrait Centered */}
          <div className="relative z-0 flex-1 flex items-center justify-center my-2">
            <div className="relative w-56 h-64 md:w-64 md:h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto}
                alt={activePlayer.name}
                className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-transform duration-500 rounded-2xl"
              />
            </div>
          </div>

          {/* Bottom Frosted Glass Card: "Running - Outdoor 5.7km" with live pulse wave */}
          <div className="relative z-10 w-full bg-black/55 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-bold text-white tracking-wide">
                  Running
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Score {activePlayer.score.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Outdoor</span>
              <span className="font-mono text-white font-bold">5.7 km</span>
            </div>

            {/* Glowing Smooth Waveform Polyline (ECG pulse effect from image) */}
            <div className="w-full h-11 relative">
              <svg
                viewBox="0 0 300 60"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="ecgGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#00ff87" stopOpacity="1" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="ecgFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff87" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00ff87" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 0 45 Q 35 44 60 40 T 110 32 T 145 15 T 165 42 T 195 24 T 235 34 T 300 20 L 300 60 L 0 60 Z"
                  fill="url(#ecgFill)"
                />

                <path
                  d="M 0 45 Q 35 44 60 40 T 110 32 T 145 15 T 165 42 T 195 24 T 235 34 T 300 20"
                  fill="none"
                  stroke="url(#ecgGlow)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(0,255,135,0.7)]"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ──────────────── CARD 2: TOP-RIGHT "GOALS & ASSISTS OVER MATCHDAYS" (8 cols) ──────────────── */}
        <div className="lg:col-span-8 bg-gradient-to-b from-[#0f1118]/90 via-[#0a0c10]/95 to-[#06070a] border border-white/10 rounded-[32px] p-7 md:p-9 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[440px]">
          
          {/* Top-Right Inward Cutout Notch with Floating Circular ↗ Button */}
          <div className="absolute top-0 right-0 z-20">
            <button
              onClick={onExploreMore}
              aria-label="Explore Full Analytics"
              className="m-5 md:m-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#050608] border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl hover:border-white/50 group"
            >
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-slate-200 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Card Header: "Goals & Assists" and Total Goals / Total Assists stats */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pr-16 z-10">
            <div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-[0.95]">
                Goals &<br />Assists
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-2 flex items-center gap-2">
                <span>MATCHDAY BY MATCHDAY TRAJECTORY</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">MW 01 → MW 38</span>
              </p>
            </div>

            {/* Match Output Counters: Goals and Assists */}
            <div className="flex items-center gap-6 pt-1 sm:pt-0">
              {/* Goals */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1 flex items-center gap-1">
                  <span className="text-amber-400">⚽</span> Goals
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                    {activePlayer.stats.goals}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    (xG {(activePlayer.stats.goals * 0.88 + activePlayer.stats.sot * 0.15).toFixed(1)})
                  </span>
                </div>
              </div>

              <div className="h-9 w-[1px] bg-white/10" />

              {/* Assists */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1 flex items-center gap-1">
                  <span className="text-cyan-400">🅰️</span> Assists
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                    {activePlayer.stats.assists}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    (xA {(activePlayer.stats.assists * 0.82 + activePlayer.stats.fa * 0.08).toFixed(1)})
                  </span>
                </div>
              </div>

              <div className="h-9 w-[1px] bg-white/10 hidden sm:block" />

              {/* Total G+A */}
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1">
                  Total G+A
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                    {activePlayer.stats.goals + activePlayer.stats.assists}
                  </span>
                  <span className="text-xs font-mono text-slate-400">pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Filter Pills: [All G+A] [Goals] [Assists] */}
          <div className="flex items-center gap-2 mt-4 z-10">
            {(['all', 'goals', 'assists'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setViewFilter(filter)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                  viewFilter === filter
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter === 'all' ? 'All G+A' : filter === 'goals' ? 'Goals Only' : 'Assists Only'}
              </button>
            ))}

            {/* Hovered Matchday Tooltip Preview */}
            {hoveredMatch && (
              <div className="ml-auto flex items-center gap-2 text-xs font-mono text-slate-200 bg-black/70 px-3 py-1 rounded-full border border-white/10 animate-in fade-in duration-150">
                <span className="font-bold text-white">MW {hoveredMatch.mw}</span>
                <span>vs {hoveredMatch.opp} ({hoveredMatch.isHome ? 'H' : 'A'})</span>
                <span className="text-amber-400 font-bold">⚽ {hoveredMatch.goals}</span>
                <span className="text-cyan-400 font-bold">🅰️ {hoveredMatch.assists}</span>
                {hoveredMatch.played && (
                  <span className="text-emerald-400 font-semibold">{hoveredMatch.rating}★</span>
                )}
              </div>
            )}
          </div>

          {/* Main Visual: 38 Matchday Progression Equalizer Bars */}
          <div className="my-6 z-10">
            <div className="flex items-end justify-between gap-1 sm:gap-1.5 h-36 px-1">
              {matchdays.map((m) => {
                const isHovered = hoveredMw === m.mw;
                
                // Height based on active filter
                let barHeight = m.height;
                if (viewFilter === 'goals') {
                  barHeight = m.played ? Math.max(16, m.goals * 45) : m.height * 0.7;
                } else if (viewFilter === 'assists') {
                  barHeight = m.played ? Math.max(16, m.assists * 50) : m.height * 0.5;
                }

                // Bar Color depending on played, goals, assists
                let barColor = '';
                if (!m.played) {
                  // Projected upcoming matchweeks
                  barColor = 'bg-gradient-to-t from-slate-800 via-slate-700/80 to-slate-600/50';
                } else if (m.goals > 0 && m.assists > 0) {
                  // Both Goal and Assist
                  barColor = 'bg-gradient-to-t from-amber-600 via-pink-600 to-cyan-400';
                } else if (m.goals > 0) {
                  // Goal scored
                  barColor = isPL
                    ? 'bg-gradient-to-t from-pink-700 via-[#e90052] to-amber-400'
                    : 'bg-gradient-to-t from-red-700 via-[#ea0029] to-amber-400';
                } else if (m.assists > 0) {
                  // Assist provided
                  barColor = 'bg-gradient-to-t from-indigo-700 via-violet-500 to-cyan-400';
                } else {
                  // Played without direct goal/assist
                  barColor = 'bg-gradient-to-t from-slate-700/80 via-slate-600/70 to-slate-500/60';
                }

                return (
                  <div
                    key={m.mw}
                    onMouseEnter={() => setHoveredMw(m.mw)}
                    onMouseLeave={() => setHoveredMw(null)}
                    className="flex-1 flex flex-col justify-end items-center h-full group/bar cursor-pointer"
                  >
                    <div
                      className={`w-full rounded-full transition-all duration-200 ${barColor} ${
                        isHovered ? 'brightness-150 scale-y-105' : 'group-hover/bar:brightness-125'
                      }`}
                      style={{
                        height: `${barHeight}%`,
                        opacity: m.played ? 1 : 0.45,
                        boxShadow:
                          m.goals > 0 || isHovered
                            ? '0 0 10px rgba(233, 0, 82, 0.6)'
                            : 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Matchday Milestones below bars */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-4 px-2">
              <span className="font-semibold text-white/90">MW 01</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MW 08 (Current)
              </span>
              <span className="font-semibold text-slate-400">MW 20 (Mid-Season)</span>
              <span className="font-semibold text-white/90">MW 38 (Target)</span>
            </div>
          </div>

          {/* Bottom Controls: "Explore more ↗" pill button and football legend */}
          <div className="flex items-center justify-between flex-wrap gap-4 z-10 pt-2 border-t border-white/5">
            {/* Asymmetric Pill Button with attached circular arrow icon */}
            <button
              onClick={onExploreMore}
              className={`group flex items-center justify-between gap-3 pl-6 pr-2 py-2 rounded-full font-display font-bold text-sm text-white shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                isPL
                  ? 'bg-gradient-to-r from-[#0055ff] via-[#1677ff] to-[#2563eb] shadow-blue-500/25'
                  : 'bg-gradient-to-r from-[#ea0029] via-[#f94d1e] to-[#ff5722] shadow-red-500/25'
              }`}
            >
              <span>Explore more</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Goals & Assists Legend and Matchday Icons */}
            <div className="flex items-center gap-4 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-[#e90052]" />
                <span className="text-slate-300">Goals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                <span className="text-slate-300">Assists</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-slate-500">Projected</span>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────── CARD 3: BOTTOM-LEFT "PERSONAL STATISTICS" (7 cols) ──────────────── */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#0f1118]/90 via-[#0a0c10]/95 to-[#06070a] border border-white/10 rounded-[32px] p-7 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[400px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Personal<br />Statistics
              </h2>

              <button
                onClick={() => onOpenPlayer(activePlayer)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                Detailed breakdown <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs font-mono text-slate-400 max-w-sm mb-6">
              Position-calibrated multi-dimensional vector benchmarked across {activePlayer.team} & {league === 'PL' ? 'Premier League' : 'La Liga'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 6-Axis Radar Polygon */}
            <div className="md:col-span-6 flex flex-col items-center justify-center relative">
              <div className="w-64 h-64 relative flex items-center justify-center">
                <svg viewBox="0 0 260 260" className="w-full h-full">
                  {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
                    const pts = radarPoints
                      .map((p) => {
                        const r = scale * maxR;
                        const x = cx + r * Math.cos(p.angle);
                        const y = cy + r * Math.sin(p.angle);
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return (
                      <polygon
                        key={sIdx}
                        points={pts}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="1.2"
                      />
                    );
                  })}

                  {radarPoints.map((p, i) => {
                    const x = cx + maxR * Math.cos(p.angle);
                    const y = cy + maxR * Math.sin(p.angle);
                    return (
                      <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={x}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  <polygon
                    points={polygonPoints}
                    fill={isPL ? 'rgba(233, 0, 82, 0.28)' : 'rgba(234, 0, 41, 0.28)'}
                    stroke={accentColor}
                    strokeWidth="2.4"
                    className="filter drop-shadow-[0_0_10px_rgba(233,0,82,0.4)]"
                  />

                  {radarPoints.map((p, i) => {
                    const r = (p.val / 100) * maxR;
                    const x = cx + r * Math.cos(p.angle);
                    const y = cy + r * Math.sin(p.angle);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#ffffff"
                        stroke={accentColor}
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>

                <div className="absolute top-1 text-[11px] font-bold text-slate-200">
                  {radar.vitesse} Vitesse
                </div>
                <div className="absolute right-0 top-1/4 text-[11px] font-bold text-slate-200">
                  {radar.dribbles} Dribbles
                </div>
                <div className="absolute right-0 bottom-1/4 text-[11px] font-bold text-slate-200">
                  {radar.physique} Physique
                </div>
                <div className="absolute bottom-1 text-[11px] font-bold text-slate-200">
                  {radar.passing} Passing
                </div>
                <div className="absolute left-0 bottom-1/4 text-[11px] font-bold text-slate-200">
                  {radar.shooting} Shooting
                </div>
                <div className="absolute left-0 top-1/4 text-[11px] font-bold text-slate-200">
                  {radar.impact} Impact
                </div>
              </div>
            </div>

            {/* Hatched Pattern Penalty Capsules */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="bg-[#080b12] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-2xl text-white">
                      {Math.round(75 + activePlayer.stats.goals * 2)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/62</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                    ON-PENALTY GOALS
                  </span>
                </div>

                <div className="flex items-center gap-1.5 h-8 bg-black/60 rounded-xl p-1 border border-white/5">
                  <div className="w-10 h-full rounded-lg bg-indigo-500/80 flex items-center justify-center text-[10px] font-bold text-white">
                    79%
                  </div>
                  <div className="flex-1 h-full rounded-lg bg-stripes-cyan overflow-hidden opacity-90" />
                </div>
              </div>

              <div className="bg-[#080b12] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-2xl text-white">
                      {Math.round(88 + activePlayer.score)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/62</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                    CONVERSION EFFICIENCY
                  </span>
                </div>

                <div className="flex items-center gap-2 h-8">
                  <div className="w-14 h-full rounded-xl bg-stripes-purple opacity-90 border border-purple-500/30" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                      ●
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-500/60" />
                    <div className="w-6 h-6 rounded-full bg-purple-500" />
                    <div className="w-6 h-6 rounded-full bg-stripes-cyan border border-cyan-400/40" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Attacking Third Heatmap
                </span>
                <span className="text-white font-semibold">{activePlayer.pos} Primary Zone</span>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────── CARD 4: BOTTOM-RIGHT "FOOTBALL STYLE PACK" / KIT SHOWCASE (5 cols) ──────────────── */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0f1118]/90 via-[#0a0c10]/95 to-[#06070a] border border-white/10 rounded-[32px] p-7 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[400px]">
          <div className="flex items-center justify-between z-10">
            {/* Top Overlapping Player Avatars with Nationality Flags */}
            <div className="flex items-center -space-x-3">
              {availableStars.slice(0, 3).map((star) => {
                const photo = getPlayerPhoto(star);
                return (
                  <div
                    key={star.id}
                    className="relative w-11 h-11 rounded-full border-2 border-black overflow-hidden bg-slate-800 shadow-lg group/avatar hover:scale-110 hover:z-20 transition-transform"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={star.name}
                      className="w-full h-full object-cover"
                    />
                    {star.flag && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={star.flag}
                        alt={star.nationality}
                        className="absolute bottom-0 right-0 w-3.5 h-2.5 object-cover rounded-sm border border-black/40"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center bg-black/60 p-1 rounded-full border border-white/10 text-xs font-mono">
              {(['home', 'away', 'third'] as const).map((kit) => (
                <button
                  key={kit}
                  onClick={() => setSelectedKit(kit)}
                  className={`px-3 py-1 rounded-full uppercase text-[10px] font-bold tracking-wider transition-all ${
                    selectedKit === kit
                      ? isPL
                        ? 'bg-[#e90052] text-white shadow'
                        : 'bg-[#ea0029] text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {kit}
                </button>
              ))}
            </div>
          </div>

          {/* Stylized 3D Match Kit Graphic */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="relative w-52 h-56 flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] group/kit">
              <svg viewBox="0 0 200 220" className="w-full h-full">
                <defs>
                  <pattern id="jerseyPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                    <path
                      d="M 0 6 L 6 0 L 12 6 L 6 12 Z"
                      fill="none"
                      stroke={selectedKit === 'home' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}
                      strokeWidth="0.8"
                    />
                  </pattern>

                  <linearGradient id="kitShading" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                <path
                  d="M 65 30 L 30 50 L 10 95 L 45 110 L 60 85 L 60 195 L 140 195 L 140 85 L 155 110 L 190 95 L 170 50 L 135 30 C 130 45, 70 45, 65 30 Z"
                  fill={
                    selectedKit === 'home'
                      ? isPL ? '#111827' : '#ffffff'
                      : selectedKit === 'away'
                      ? isPL ? '#e90052' : '#ea0029'
                      : '#fbbf24'
                  }
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="2"
                />

                <path
                  d="M 65 30 L 30 50 L 10 95 L 45 110 L 60 85 L 60 195 L 140 195 L 140 85 L 155 110 L 190 95 L 170 50 L 135 30 C 130 45, 70 45, 65 30 Z"
                  fill="url(#jerseyPattern)"
                />

                <path
                  d="M 65 30 L 30 50 L 10 95 L 45 110 L 60 85 L 60 195 L 140 195 L 140 85 L 155 110 L 190 95 L 170 50 L 135 30 C 130 45, 70 45, 65 30 Z"
                  fill="url(#kitShading)"
                />

                <path
                  d="M 70 30 C 85 52, 115 52, 130 30 Z"
                  fill="#000000"
                  stroke={accentColor}
                  strokeWidth="2"
                />

                <line
                  x1="70"
                  y1="115"
                  x2="130"
                  y2="115"
                  stroke={selectedKit === 'home' && !isPL ? '#111827' : '#ffffff'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <line
                  x1="80"
                  y1="125"
                  x2="120"
                  y2="125"
                  stroke={selectedKit === 'home' && !isPL ? '#111827' : '#ffffff'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <text
                  x="100"
                  y="165"
                  fill={selectedKit === 'home' && !isPL ? '#111827' : '#ffffff'}
                  fontSize="28"
                  fontWeight="900"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {jerseyNumber}
                </text>
              </svg>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePlayer.crest}
                alt={activePlayer.team}
                className="absolute top-14 left-1/2 -translate-x-9 w-6 h-6 object-contain filter drop-shadow"
              />
            </div>
          </div>

          {/* Heading: "Football Style Pack" */}
          <div className="z-10 pt-2 border-t border-white/5 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-0.5">
                OFFICIAL MATCHDAY ARMOUR
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                Football<br />Style Pack
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-white block">
                {activePlayer.team}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                2026/27 Edition
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
