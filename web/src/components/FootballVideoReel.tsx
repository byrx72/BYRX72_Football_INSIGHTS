'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Maximize2, Shield, Flame, Activity } from 'lucide-react';

interface MatchHighlight {
  id: string;
  title: string;
  match: string;
  league: 'PL' | 'LALIGA';
  timestamp: string;
  score: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest: string;
  awayCrest: string;
  videoUrl: string; // Embed or stream
  thumbnail: string;
  highlightNote: string;
  moneyballImpact: string;
}

const HIGHLIGHT_REELS: MatchHighlight[] = [
  {
    id: 'hl-1',
    title: 'Matchweek 8 Tactical Masterclass: Arsenal 3 - 1 Southampton',
    match: 'Arsenal vs Southampton',
    league: 'PL',
    timestamp: 'GW8 • Emirates Stadium',
    score: '3 - 1',
    homeTeam: 'Arsenal',
    awayTeam: 'Southampton',
    homeCrest: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    awayCrest: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Southampton_FC.svg',
    videoUrl: 'https://www.youtube-nocookie.com/embed/5qap5aO4i9A?autoplay=1&mute=1&loop=1&playlist=5qap5aO4i9A&controls=0&modestbranding=1',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    highlightNote: 'Saka delivers 2 assists + 1 goal. Algorithm Rating 9.42 / 10',
    moneyballImpact: '+0.34 Season Elo Adj.',
  },
  {
    id: 'hl-2',
    title: 'La Liga Jornada 8: Real Madrid 2 - 0 Villarreal',
    match: 'Real Madrid vs Villarreal',
    league: 'LALIGA',
    timestamp: 'J8 • Santiago Bernabéu',
    score: '2 - 0',
    homeTeam: 'Real Madrid',
    awayTeam: 'Villarreal',
    homeCrest: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    awayCrest: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg',
    videoUrl: 'https://www.youtube-nocookie.com/embed/7wtfhZwyrcc?autoplay=1&mute=1&loop=1&playlist=7wtfhZwyrcc&controls=0&modestbranding=1',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    highlightNote: 'Vinícius Jr golazo from 25 yards. Mbappé xG 1.48 dominance.',
    moneyballImpact: '+0.28 Season Elo Adj.',
  },
  {
    id: 'hl-3',
    title: 'Camp Nou Showcase: Barcelona 3 - 0 Alavés',
    match: 'Alavés vs Barcelona',
    league: 'LALIGA',
    timestamp: 'J8 • Mendizorrotza',
    score: '0 - 3',
    homeTeam: 'Alavés',
    awayTeam: 'Barcelona',
    homeCrest: 'https://upload.wikimedia.org/wikipedia/en/f/f8/Deportivo_Alaves_logo_%282020%29.svg',
    awayCrest: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    videoUrl: 'https://www.youtube-nocookie.com/embed/V-_O7nl0Ii0?autoplay=1&mute=1&loop=1&playlist=V-_O7nl0Ii0&controls=0&modestbranding=1',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    highlightNote: 'Lewandowski 32-min hat-trick. Lamine Yamal 4 key passes.',
    moneyballImpact: '+0.41 Season Elo Adj.',
  },
  {
    id: 'hl-4',
    title: 'Etihad Thriller: Manchester City 3 - 2 Fulham',
    match: 'Man City vs Fulham',
    league: 'PL',
    timestamp: 'GW8 • Etihad Stadium',
    score: '3 - 2',
    homeTeam: 'Man City',
    awayTeam: 'Fulham',
    homeCrest: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    awayCrest: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&controls=0',
    thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    highlightNote: 'Haaland 10 goals in 8 matches. Kovačić brace.',
    moneyballImpact: '+0.22 Season Elo Adj.',
  },
];

export function FootballVideoReel() {
  const [activeReel, setActiveReel] = useState<MatchHighlight>(HIGHLIGHT_REELS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  return (
    <div className="w-full bg-stone-950 border border-stone-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Broadcast Bar */}
      <div className="bg-stone-900/90 px-4 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            LIVE BROADCAST 2026/27
          </div>
          <span className="text-xs font-mono text-stone-400 tracking-wider hidden sm:inline">
            MW8 TACTICAL TELEMETRY FEED
          </span>
        </div>

        <div className="flex items-center gap-2">
          {HIGHLIGHT_REELS.map((reel, idx) => (
            <button
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                activeReel.id === reel.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-stone-800/60 text-stone-400 hover:text-stone-200 border border-transparent'
              }`}
            >
              CH {idx + 1}: {reel.homeTeam.slice(0, 3).toUpperCase()} v {reel.awayTeam.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Arena */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-black overflow-hidden group">
        {/* Active Stream / Video Background */}
        <div className="absolute inset-0 pointer-events-none">
          <iframe
            src={activeReel.videoUrl}
            title={activeReel.title}
            className="w-full h-full object-cover scale-105 pointer-events-none opacity-85"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80 pointer-events-none" />

        {/* Live Broadcast Scoreboard Bug Overlay (Top Left) */}
        <div className="absolute top-4 left-4 z-20 flex items-center bg-stone-950/90 backdrop-blur-md border border-stone-800 rounded-xl p-2.5 shadow-2xl gap-3">
          <div className="flex items-center gap-2">
            <img src={activeReel.homeCrest} alt="" className="w-6 h-6 object-contain" />
            <span className="font-mono text-xs font-bold text-stone-100">{activeReel.homeTeam}</span>
            <span className="bg-stone-800 text-emerald-400 font-mono text-xs font-extrabold px-2 py-0.5 rounded">
              {activeReel.score}
            </span>
            <span className="font-mono text-xs font-bold text-stone-100">{activeReel.awayTeam}</span>
            <img src={activeReel.awayCrest} alt="" className="w-6 h-6 object-contain" />
          </div>
          <div className="h-4 w-px bg-stone-800" />
          <span className="text-[11px] font-mono text-red-400 font-bold animate-pulse">88:14</span>
        </div>

        {/* Video Tactical Overlay Info (Bottom Left) */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                {activeReel.timestamp}
              </span>
              <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                {activeReel.moneyballImpact}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-stone-100 font-semibold drop-shadow-md">
              {activeReel.title}
            </h3>
            <p className="text-xs text-stone-300 font-sans mt-1 max-w-lg drop-shadow">
              {activeReel.highlightNote}
            </p>
          </div>

          {/* Broadcast Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white p-2.5 rounded-xl border border-stone-700/60 backdrop-blur-sm transition-all"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <div className="flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-stone-700/60 text-xs font-mono text-stone-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>LIVE BROADCAST 4K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reel Switcher Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-stone-900/50 border-t border-stone-800">
        {HIGHLIGHT_REELS.map((reel) => {
          const isSelected = activeReel.id === reel.id;
          return (
            <button
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className={`flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-stone-800/90 border border-emerald-500/50 shadow-lg'
                  : 'bg-stone-900/40 hover:bg-stone-800/50 border border-stone-800/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-800">
                <img src={reel.thumbnail} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-stone-300'}`} fill="currentColor" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-stone-200 truncate font-semibold">{reel.match}</p>
                <p className="text-[10px] font-mono text-emerald-400">{reel.score} • {reel.league}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FootballVideoReel;
