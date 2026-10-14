'use client';

import React, { useState } from 'react';
import { LeagueId, Player } from '@/types/football';
import { ALL_TEAMS, ClubTeam } from '@/data/teamsData';
import {
  Trophy,
  Compass,
  GitCompare,
  Code2,
  Sparkles,
  Shield,
  ArrowRight,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  Radio,
  Tv,
  X,
  Users,
  MapPin,
  Flame,
} from 'lucide-react';
import { FootballVideoReel } from './FootballVideoReel';
import { SquaresTerminal } from './ui/squares-terminal';

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
  const [isSimulatingLive, setIsSimulatingLive] = useState(false);
  const [livePulseKey, setLivePulseKey] = useState(0);
  const [selectedClubModal, setSelectedClubModal] = useState<ClubTeam | null>(null);

  // Exact UI interaction from user's screenshot: active menu selection with dynamic photo change
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<number>(0);
  
  // Theme tone toggle: 'dark' (luxury obsidian) or 'parchment' (exact sand/cream tone in user's screenshot)
  const [aestheticTone, setAestheticTone] = useState<'dark' | 'parchment'>('dark');

  const leaguePlayers = players.filter((p) => p.league === currentLeague);
  const topPlayer = [...leaguePlayers].sort((a, b) => b.seasonScore - a.seasonScore)[0] || players[0];
  const leagueClubs = ALL_TEAMS.filter((c) => c.league === currentLeague);

  const handleLiveSync = () => {
    setIsSimulatingLive(true);
    setTimeout(() => {
      setIsSimulatingLive(false);
      setLivePulseKey((k) => k + 1);
    }, 700);
  };

  // Menu items corresponding directly to the user's screenshot structure (Tournaments / Private lessons / Exclusive events...)
  const interactiveShowcaseItems = [
    {
      id: 'tournaments',
      title: 'Season Leaderboard',
      category: '2026/27 CAMPAIGN',
      description: 'Objective player rankings calibrated across all 38 Premier League and La Liga matchweeks with Per-90 standardizing.',
      photo: '/players/haaland.jpg',
      badge: '9.04 ★ Erling Haaland • Round 8 Leader',
      statLine: '14 Goals • 3 Assists • 0.95 p90 Goal Ratio',
      actionTab: 'leaderboard' as const,
      actionText: 'View 2026/27 Leaderboard',
    },
    {
      id: 'tactical',
      title: 'Tactical 4-3-3 Pitch',
      category: 'FORMATION BLUEPRINT',
      description: 'The mathematically optimal starting XI placed on a high-fidelity turf pitch board with auto-selected starters and reserves.',
      photo: '/players/saka.jpg',
      badge: '8.91 ★ Bukayo Saka • RW In-Form',
      statLine: '5 Goals • 8 Assists • 32 Key Passes',
      actionTab: 'totw' as const,
      actionText: 'Open Tactical Pitch View',
    },
    {
      id: 'radar',
      title: 'Head-to-Head Radar',
      category: 'SPIDER SHOWDOWN',
      description: 'Multi-polygon spider chart comparing any two European superstars across 6 standardized performance dimensions.',
      photo: '/players/mbappe.jpg',
      badge: '9.01 ★ Kylian Mbappé • Real Madrid Attack',
      statLine: '11 Goals • 4 Assists • 99 Attacking Impact',
      actionTab: 'compare' as const,
      actionText: 'Launch Radar Showdown',
    },
    {
      id: 'clubs',
      title: 'All 20 League Clubs',
      category: 'ARCHITECTURAL ROSTER',
      description: 'Official crests, stadiums, managers, and complete 2026/27 rosters for every top-flight European club.',
      photo: '/players/vinicius.jpg',
      badge: '8.99 ★ Vinícius Júnior • Real Madrid CF',
      statLine: '7 Goals • 7 Assists • Santiago Bernabéu',
      actionTab: 'teams' as const,
      actionText: 'Explore 20-Club Directory',
    },
    {
      id: 'algorithm',
      title: 'Moneyball Algorithm',
      category: 'THE MATHEMATICAL STANDARD',
      description: 'Min-max feature scaling, positional criteria weights (FWD, MID, DEF, GK), and dynamic opponent Elo context factors.',
      photo: '/players/yamal.jpg',
      badge: '9.08 ★ Lamine Yamal • Ballon d’Or Pace',
      statLine: '8 Goals • 9 Assists • Spatial Parity Model',
      actionTab: 'leaderboard' as const,
      actionText: 'Inspect Formula Matrix',
    },
  ];

  const currentItem = interactiveShowcaseItems[activeInteractiveTab];

  const isDark = aestheticTone === 'dark';

  return (
    <div className={`relative space-y-28 py-6 font-sans transition-colors duration-500 ${
      isDark ? 'text-slate-100' : 'text-[#19211c]'
    }`}>
      
      {/* ===================== TONE CONTROLLER PILL ===================== */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
            Editorial Experience:
          </span>
          <div className="flex items-center p-1 rounded-full border border-white/10 bg-black/40">
            <button
              onClick={() => setAestheticTone('dark')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                isDark ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Dark Obsidian</span>
            </button>
            <button
              onClick={() => setAestheticTone('parchment')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                !isDark ? 'bg-[#d8d3c5] text-[#19211c] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>Parchment Gallery (Given UI)</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleLiveSync}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingLive ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Sync 2026/27 Live Feed</span>
        </button>
      </div>

      {/* ===================== FLAGSHIP SECTION: THE GIVEN UI DESIGN INTERACTION ===================== */}
      <section className={`relative rounded-[2.5rem] overflow-hidden p-8 sm:p-14 lg:p-20 shadow-2xl transition-all duration-500 border ${
        isDark
          ? 'bg-gradient-to-b from-[#0b100d] via-[#0d1410] to-[#080b09] border-emerald-500/20'
          : 'bg-[#f0ebe1] border-[#d8d1c2] text-[#1a211c]'
      }`}>
        
        {/* Subtle Ambient Vignette */}
        <div className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none ${
          isDark ? 'bg-[#142319]/40' : 'bg-[#e2dacb]/60'
        }`} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Far Left Subtle Faded Crop (Replicating the screenshot's cropped secondary photo) */}
          <div className="hidden xl:block absolute -left-12 top-1/4 w-28 h-48 rounded-2xl overflow-hidden opacity-25 filter grayscale pointer-events-none">
            <img
              src="/players/raya.jpg"
              alt="Faded preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Left Column: Category Label & Large Vertical Serif Menu (Exact UI match) */}
          <div className="lg:col-span-6 space-y-8 pl-0 xl:pl-8">
            
            {/* Small Tracking Uppercase Subtitle (like "ACTIVITIES" in screenshot) */}
            <div className={`text-[11px] font-mono tracking-[0.3em] uppercase font-bold ${
              isDark ? 'text-emerald-400/90' : 'text-[#5d7363]'
            }`}>
              {currentItem.category}
            </div>

            {/* Vertical List of Items in Elegant High-Contrast Serif */}
            <div className="space-y-4">
              {interactiveShowcaseItems.map((item, index) => {
                const isActive = activeInteractiveTab === index;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveInteractiveTab(index)}
                    onClick={() => setActiveInteractiveTab(index)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    <h2
                      className={`text-3xl sm:text-5xl lg:text-6xl font-serif font-light transition-all duration-300 ${
                        isActive
                          ? isDark
                            ? 'text-white font-normal translate-x-1'
                            : 'text-[#19221c] font-normal translate-x-1'
                          : isDark
                          ? 'text-slate-500 hover:text-slate-300'
                          : 'text-[#9ca3af] hover:text-[#4b5563]'
                      }`}
                    >
                      {item.title}
                    </h2>
                  </div>
                );
              })}
            </div>

            {/* Active Item Description & Action Button */}
            <div className="pt-4 space-y-4 max-w-lg animate-in fade-in duration-300">
              <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                isDark ? 'text-slate-300' : 'text-[#424d45]'
              }`}>
                {currentItem.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (currentItem.id === 'algorithm') {
                      onOpenAlgorithm();
                    } else {
                      onNavigateToApp(currentItem.actionTab);
                    }
                  }}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                    isDark
                      ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-emerald-950/40'
                      : 'bg-[#1e2721] text-[#f4efe6] hover:bg-[#2c3830]'
                  }`}
                >
                  <span>{currentItem.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className={`text-[11px] font-mono ${
                  isDark ? 'text-slate-400' : 'text-[#737f76]'
                }`}>
                  {currentItem.statLine}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Large Framed Photographic Showcase Card (Exact match to screenshot's right side) */}
          <div className="lg:col-span-6 relative flex justify-center">
            
            <div className={`relative w-full max-w-[460px] aspect-[4/5] rounded-[2rem] overflow-hidden border shadow-2xl transition-all duration-500 group ${
              isDark ? 'border-white/10 bg-black/80' : 'border-[#d0c9bc] bg-[#dfd9cc]'
            }`}>
              
              {/* Real Photograph with high-contrast sharpness */}
              <img
                key={currentItem.photo}
                src={currentItem.photo}
                alt={currentItem.title}
                className="w-full h-full object-cover object-top filter contrast-[1.05] animate-in fade-in duration-500 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Minimalist Turf Badge in lower corner (Just like golf ball and shoes on grass in screenshot) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 block font-bold">
                    LIVE 2026/27 TELEMETRY
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white font-serif drop-shadow-md">
                    {currentItem.badge}
                  </span>
                </div>

                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-right">
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================== SHAKURO EDITORIAL HERO SECTION ===================== */}
      <section className={`relative rounded-[2.5rem] overflow-hidden p-6 sm:p-14 lg:p-20 shadow-2xl border ${
        isDark
          ? 'bg-gradient-to-b from-[#090d0b] via-[#0d120f] to-[#070908] border-emerald-500/20'
          : 'bg-[#ebe5d8] border-[#d8d1c2]'
      }`}>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-[#141b16] border border-emerald-500/30 text-emerald-400 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                EST. 2024 • THE EUROPEAN MONEYBALL BENCHMARK
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] font-serif">
              Where Football Intuition Meets{' '}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200">
                Mathematical Precision.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-sans max-w-xl font-light">
              Traditional metrics over-index on raw goal tallies. For the active{' '}
              <strong className="text-white font-semibold">2026/27 Season</strong>, our Moneyball algorithm
              measures spatial efficiency, true progressive actions, and opponent difficulty across Europe&apos;s
              top 40 clubs in the <span className="text-emerald-300 font-medium">Premier League</span> and{' '}
              <span className="text-amber-300 font-medium">La Liga</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateToApp('leaderboard')}
                className="flex items-center gap-3 px-7 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:opacity-95 shadow-xl shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Live 2026/27 Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAlgorithm}
                className="flex items-center gap-2 px-6 py-4 rounded-full text-xs sm:text-sm font-medium text-slate-200 bg-[#141b16]/70 hover:bg-[#1a241e] border border-white/10 transition-all hover:border-emerald-500/40"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Inspect Formula Matrix</span>
              </button>

              <button
                onClick={() => onNavigateToApp('teams')}
                className="flex items-center gap-2 px-6 py-4 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-slate-900 border border-slate-800 transition-all"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>All 20 Clubs</span>
              </button>
            </div>

            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-xs font-mono">
              <div>
                <span className="block text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                  Active Gameweek
                </span>
                <span className="text-xl font-bold text-white">MW 8 (Oct 2026)</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                  Per-90 Normalization
                </span>
                <span className="text-xl font-bold text-emerald-400">100% Calibrated</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                  Context Multiplier
                </span>
                <span className="text-xl font-bold text-amber-300">1.00x – 1.25x Elo</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative">
            
            <div
              key={livePulseKey}
              onClick={() => onSelectPlayer(topPlayer)}
              className="relative p-6 sm:p-7 rounded-[2rem] bg-gradient-to-b from-[#141b16] via-[#0d120f] to-[#080b09] border border-emerald-500/30 shadow-2xl shadow-black/80 cursor-pointer group hover:border-emerald-400/80 transition-all duration-300"
            >
              
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  #1 2026/27 Leader
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30">
                  {topPlayer.position} • #{topPlayer.number}
                </span>
              </div>

              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-5">
                <img
                  src={topPlayer.avatar}
                  alt={topPlayer.name}
                  className="w-full h-full object-cover object-top filter contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-300 block">
                      {topPlayer.team}
                    </span>
                    <h3 className="text-2xl font-black text-white font-serif drop-shadow-md">
                      {topPlayer.name}
                    </h3>
                  </div>

                  <div className="text-right bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {topPlayer.seasonScore.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-mono">
                      Rating ★
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-slate-400 text-[10px] block">2026/27 Goals</span>
                  <span className="text-base font-bold text-white">{topPlayer.seasonStats.goals}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Assists</span>
                  <span className="text-base font-bold text-emerald-300">{topPlayer.seasonStats.assists}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Key Passes</span>
                  <span className="text-base font-bold text-teal-300">{topPlayer.seasonStats.keyPasses}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-emerald-400 font-semibold pt-3 border-t border-white/10">
                <span>Inspect Full 2026/27 Gameweek Breakdown</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================== LIVE 2026/27 BROADCAST & HIGHLIGHTS THEATER ===================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Tv className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-light">
              Live 2026/27 Matchday Broadcast &amp; Highlights
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
            🔴 MW8 Telemetry • Multi-Channel Feed
          </span>
        </div>
        <FootballVideoReel />
      </section>

      {/* ===================== SQUARES TERMINAL: ALGORITHMIC TELEMETRY MATRIX ===================== */}
      <section className="relative rounded-[2rem] overflow-hidden border border-emerald-500/20 bg-stone-950 p-6 sm:p-10 shadow-2xl">
        <SquaresTerminal
          squareSize={28}
          flickerRate={0.06}
          speed={0.4}
          borderColor="rgba(16, 185, 129, 0.08)"
          hoverFillColor="rgba(52, 211, 153, 0.22)"
          glowColor="rgba(16, 185, 129, 0.4)"
          className="absolute inset-0"
        />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              REACT BITS PRO • SQUARES TERMINAL MATRIX
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-light text-white leading-tight">
              Real-Time Algorithmic Telemetry &amp; Elo Ingestion Engine
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Ingesting live Matchweek 8 event streams for all 40 European clubs. Every tackle, progressive pass,
              box entry, and xG chance is normalized per-90 and scaled against our spatial Moneyball matrix.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAlgorithm}
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-mono text-xs font-bold transition-all shadow-lg"
              >
                Inspect Live Equation Matrix
              </button>
              <span className="text-xs font-mono text-stone-400">
                40 Clubs • 78 Stars • 220 Metrics Calibrated
              </span>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Ingestion Stream</span>
              <span className="text-xl font-bold text-emerald-400">2026/27 MW8</span>
              <span className="text-[10px] text-stone-500 block mt-1">Live Telemetry Synchronized</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Clubs Database</span>
              <span className="text-xl font-bold text-white">40 Top-Flight</span>
              <span className="text-[10px] text-stone-500 block mt-1">20 PL + 20 La Liga</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Formula Stability</span>
              <span className="text-xl font-bold text-cyan-400">99.8% Spatial</span>
              <span className="text-[10px] text-stone-500 block mt-1">Per-90 Variance Dampened</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Dynamic Elo Range</span>
              <span className="text-xl font-bold text-amber-300">1.00x – 1.25x</span>
              <span className="text-[10px] text-stone-500 block mt-1">Difficulty Weighted</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SHAKURO EDITORIAL PACING: THE HERITAGE PHILOSOPHY ===================== */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400/90 font-bold">
            The Analytical Philosophy
          </span>
          <blockquote className="text-2xl sm:text-4xl font-light font-serif text-slate-200 leading-snug italic">
            &ldquo;Football is not merely measured in the 90th minute by goal tallies. It is governed by spatial efficiency, defensive containment, and opponent difficulty.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
            <span>BYRX72 Football Insights</span>
            <span>•</span>
            <span className="text-emerald-400">European Model v2.4</span>
            <span>•</span>
            <span>2026/27 Season Standard</span>
          </div>
        </div>
      </section>

      {/* ===================== 2026/27 EUROPEAN HONOR ROLL (REAL PHOTOS) ===================== */}
      <section className="space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Live 2026/27 Roster Benchmark
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-white font-serif mt-1">
              Top Ranked European Superstars
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-[#101612] p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => onLeagueChange('PL')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentLeague === 'PL'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
            </button>
            <button
              onClick={() => onLeagueChange('LALIGA')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentLeague === 'LALIGA'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇪🇸 La Liga EA Sports
            </button>
          </div>
        </div>

        {/* 4 Featured Roster Cards with Real Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaguePlayers.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPlayer(p)}
              className="group p-5 rounded-[2rem] bg-gradient-to-b from-[#131915] to-[#0a0e0c] border border-white/10 hover:border-emerald-500/50 hover:bg-[#161f19] transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black mb-4">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-full h-full object-cover object-top filter contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className="absolute top-2.5 right-2.5 text-base shadow">{p.flag}</span>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-white/10">
                  {p.position} #{p.number}
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-serif truncate">
                    {p.name}
                  </h4>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {p.seasonScore.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{p.team}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>{p.seasonStats.goals} G</span>
                <span>{p.seasonStats.assists} A</span>
                <span>{p.seasonStats.keyPasses} KP</span>
                <span className="text-emerald-400 font-bold">{p.seasonStats.matches} MW</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ===================== ALL 20 CLUBS DIRECTORY PREVIEW ===================== */}
      <section className="space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5" />
              2026/27 League Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-white font-serif mt-1">
              All 20 {currentLeague === 'PL' ? 'Premier League' : 'La Liga'} Clubs
            </h2>
          </div>

          <button
            onClick={() => onNavigateToApp('teams')}
            className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 font-mono"
          >
            <span>Explore Complete 20-Club Stadium Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 p-6 sm:p-8 rounded-[2rem] bg-[#0c120e] border border-white/10">
          {leagueClubs.map((club) => (
            <div
              key={club.id}
              onClick={() => setSelectedClubModal(club)}
              className="p-3.5 rounded-2xl bg-black/60 border border-white/5 hover:border-emerald-500/50 hover:scale-110 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 text-center group"
              title={`Click to view ${club.name} 2026/27 Squad`}
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

      {/* 40-Club Quick Squad Modal */}
      {selectedClubModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700/80 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 p-2 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-center">
                  <img src={selectedClubModal.crest} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-serif text-white">{selectedClubModal.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {selectedClubModal.code}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    {selectedClubModal.stadium} • Cap: {selectedClubModal.capacity} • Mgr: {selectedClubModal.manager}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClubModal(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Squad List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                2026/27 Live Squad Roster &amp; Ratings
              </h4>
              <div className="space-y-2">
                {players
                  .filter(
                    (p) =>
                      p.teamShort === selectedClubModal.code ||
                      p.team.toLowerCase().includes(selectedClubModal.shortName.toLowerCase())
                  )
                  .map((player) => (
                    <div
                      key={player.id}
                      onClick={() => {
                        setSelectedClubModal(null);
                        onSelectPlayer(player);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-emerald-500/50 hover:bg-stone-800/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={player.avatar}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-stone-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-emerald-300">
                              {player.name}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              #{player.number} • {player.position}
                            </span>
                          </div>
                          <span className="text-xs text-stone-400 font-mono">
                            {player.seasonStats.goals} Goals • {player.seasonStats.assists} Assists • {player.seasonStats.keyPasses} KP
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black font-mono text-emerald-400">
                          {player.seasonScore.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500 block">Rating</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs font-mono text-stone-400">
                Key Star: <strong className="text-emerald-400">{selectedClubModal.starPlayer}</strong>
              </span>
              <button
                onClick={() => {
                  setSelectedClubModal(null);
                  onNavigateToApp('leaderboard');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold text-xs font-mono transition-all"
              >
                View in 2026/27 Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

