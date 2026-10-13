'use client';

import React from 'react';
import { LeagueId, Player } from '@/types/football';
import { ALL_TEAMS } from '@/data/teamsData';
import {
  Trophy,
  Compass,
  GitCompare,
  Code2,
  Sparkles,
  Shield,
  ArrowRight,
  Flame,
  CheckCircle2,
  Zap,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Star,
} from 'lucide-react';

interface LuxuryLandingPageProps {
  currentLeague: LeagueId;
  onLeagueChange: (league: LeagueId) => void;
  onNavigateToApp: (tab: 'leaderboard' | 'totw' | 'compare' | 'teams') => void;
  onOpenAlgorithm: () => void;
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const LuxuryLandingPage: React.FC<LuxuryLandingPageProps> = ({
  currentLeague,
  onLeagueChange,
  onNavigateToApp,
  onOpenAlgorithm,
  players,
  onSelectPlayer,
}) => {
  const leaguePlayers = players.filter((p) => p.league === currentLeague);
  const topPlayer = [...leaguePlayers].sort((a, b) => b.seasonScore - a.seasonScore)[0] || players[0];
  const leagueClubs = ALL_TEAMS.filter((c) => c.league === currentLeague);

  return (
    <div className="relative space-y-24 py-6">
      
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative rounded-3xl overflow-hidden border border-emerald-500/20 bg-gradient-to-b from-stone-950 via-slate-950 to-emerald-950/40 p-6 sm:p-12 lg:p-16 shadow-2xl">
        
        {/* Subtle Ambient Vignette & Spotlights */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Prestige Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase bg-slate-900/90 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              EST. 2024 • THE EUROPEAN MONEYBALL BENCHMARK
            </div>

            {/* Editorial Title */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08] font-sans">
              Where Football Intuition Meets{' '}
              <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                Mathematical Precision.
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
              Traditional metrics over-index on tap-in goals. We engineered a position-adjusted,
              per-90 normalized intelligence model calibrated against Europe&apos;s top 40 clubs across
              the <span className="text-emerald-400 font-semibold">Premier League</span> and{' '}
              <span className="text-amber-400 font-semibold">La Liga</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateToApp('leaderboard')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Enter Live Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAlgorithm}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all hover:border-emerald-500/50"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Inspect Scoring Matrix</span>
              </button>

              <button
                onClick={() => onNavigateToApp('teams')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-transparent hover:bg-slate-900 border border-slate-800 transition-all"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Browse 20 Clubs</span>
              </button>
            </div>

            {/* Live Ticker Counter Pills */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Analyzed Matches</span>
                <span className="text-lg font-bold text-white">400+ GW Fixtures</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Per-90 Standard</span>
                <span className="text-lg font-bold text-emerald-400">100% Normalized</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Opponent Multiplier</span>
                <span className="text-lg font-bold text-amber-400">1.00x – 1.25x</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Luxury Star Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Top Star Spotlight Floating Card */}
            <div
              onClick={() => onSelectPlayer(topPlayer)}
              className="relative p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 cursor-pointer group hover:border-emerald-400 transition-all duration-300"
            >
              
              {/* Card Header Pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  #1 Algorithmic Leader
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30">
                  {topPlayer.position}
                </span>
              </div>

              {/* Player Portrait & Team Crest */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-lg shadow-emerald-500/20 bg-slate-800 shrink-0">
                  <img
                    src={topPlayer.avatar}
                    alt={topPlayer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 text-xs">{topPlayer.flag}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors truncate">
                    {topPlayer.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{topPlayer.team}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{topPlayer.seasonStats.goals} Goals</span> •{' '}
                    <span>{topPlayer.seasonStats.assists} Assists</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 font-mono">
                    {topPlayer.seasonScore.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
                    Rating ★
                  </span>
                </div>
              </div>

              {/* Radar Highlights Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300 text-[11px]">
                  <span>Attacking Threat</span>
                  <span className="font-mono font-bold text-emerald-400">{topPlayer.radar.attacking} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div style={{ width: `${topPlayer.radar.attacking}%` }} className="h-full bg-emerald-400" />
                </div>

                <div className="flex justify-between items-center text-slate-300 text-[11px] pt-1">
                  <span>Vision & Creation</span>
                  <span className="font-mono font-bold text-teal-300">{topPlayer.radar.creation} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div style={{ width: `${topPlayer.radar.creation}%` }} className="h-full bg-teal-400" />
                </div>
              </div>

              {/* Card Footer action */}
              <div className="mt-4 flex items-center justify-between text-xs text-emerald-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Click to Inspect Full Statistical Matrix</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================== EUROPEAN STAR SPOTLIGHT CAROUSEL ===================== */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Europe&apos;s Elite Roster
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sans mt-1">
              Top Ranked Superstars (Season 2024/25)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onLeagueChange('PL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentLeague === 'PL' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Stars
            </button>
            <button
              onClick={() => onLeagueChange('LALIGA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentLeague === 'LALIGA' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              🇪🇸 La Liga Stars
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Star Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaguePlayers.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPlayer(p)}
              className="group p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30">
                  {p.position} #{p.number}
                </span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {p.seasonScore.toFixed(2)} ★
                </span>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-xs">{p.flag}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{p.team}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{p.seasonStats.goals} Goals</span>
                <span>{p.seasonStats.assists} Assists</span>
                <span>{p.seasonStats.keyPasses} KP</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ===================== THE THREE ALGORITHMIC PILLARS ===================== */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            The Algorithmic Triad
          </span>
          <h2 className="text-3xl font-black text-white">
            Engineering an Objective Rating
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            How our Moneyball model removes bias and establishes a rigorous mathematical standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Per-90 Standardizing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Substitution bias is eliminated. A 30-minute impact cameo is scaled proportionally to a full match, ensuring fair comparisons across starters and substitutes.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] font-mono text-emerald-300 border border-slate-800">
              Metric_p90 = (Value / Minutes) × 90
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-mono font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Positional Weight Vectors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Defenders are weighted 35% on tackles & interceptions and 20% on clean sheets. Midfielders on progressive passes and key chances. Strikers on finishing efficiency.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] font-mono text-teal-300 border border-slate-800">
              Score = Σ (Subscore_i × Weight_pos)
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Opponent Elo Multiplier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scoring or keeping a clean sheet against a title contender like Manchester City or Real Madrid carries an up to 1.25x multiplier over lower-tier fixtures.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] font-mono text-cyan-300 border border-slate-800">
              Final = BaseRating × ContextTier
            </div>
          </div>

        </div>

      </section>

      {/* ===================== ALL 20 CLUBS DIRECTORY PREVIEW ===================== */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5" />
              Full League Integration
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sans mt-1">
              All 20 {currentLeague === 'PL' ? 'Premier League' : 'La Liga'} Clubs
            </h2>
          </div>

          <button
            onClick={() => onNavigateToApp('teams')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
          >
            <span>View Full Club Directory & Stadiums</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 20 Club Crest Badges Strip */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          {leagueClubs.map((club) => (
            <div
              key={club.id}
              onClick={() => onNavigateToApp('teams')}
              className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:scale-110 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src={club.crest}
                  alt={club.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-emerald-300 truncate w-full">
                {club.code}
              </span>
            </div>
          ))}
        </div>

      </section>

      {/* ===================== FEATURE TRIGGER STRIP ===================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Trigger 1: Team of the Week 4-3-3 */}
        <div
          onClick={() => onNavigateToApp('totw')}
          className="group p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all duration-300 shadow-xl"
        >
          <Compass className="w-8 h-8 text-emerald-400 mb-4 group-hover:rotate-45 transition-transform" />
          <h3 className="text-lg font-bold text-white mb-2">Tactical 4-3-3 Pitch View</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Inspect the weekly 11 selected automatically by the algorithm on a high-fidelity football pitch.
          </p>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Launch Tactical Pitch →
          </span>
        </div>

        {/* Trigger 2: Head-to-Head Radar */}
        <div
          onClick={() => onNavigateToApp('compare')}
          className="group p-8 rounded-3xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/30 hover:border-teal-400 cursor-pointer transition-all duration-300 shadow-xl"
        >
          <GitCompare className="w-8 h-8 text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-white mb-2">Head-to-Head Spider Radar</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Compare any two superstars across 6 standardized dimensions (Attacking, Creation, Retention, Defending).
          </p>
          <span className="text-xs font-bold text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Launch Radar Comparison →
          </span>
        </div>

        {/* Trigger 3: Live Sandbox */}
        <div
          onClick={onOpenAlgorithm}
          className="group p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all duration-300 shadow-xl"
        >
          <Code2 className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-white mb-2">Interactive Formula Sandbox</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Test the math live: adjust goals, assists, tackles, and opponent difficulty sliders to calculate ratings on the fly.
          </p>
          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Open Formula Sandbox →
          </span>
        </div>

      </section>

    </div>
  );
};
