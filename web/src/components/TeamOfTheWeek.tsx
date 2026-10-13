'use client';

import React, { useState, useMemo } from 'react';
import { Player, LeagueId } from '@/types/football';
import { Trophy, Compass, Star, ChevronRight, Zap } from 'lucide-react';

interface TeamOfTheWeekProps {
  players: Player[];
  league: LeagueId;
  onSelectPlayer: (player: Player) => void;
}

export const TeamOfTheWeek: React.FC<TeamOfTheWeekProps> = ({
  players,
  league,
  onSelectPlayer,
}) => {
  const [selectedGw, setSelectedGw] = useState<number>(6);

  // Filter players for this league and chosen Gameweek
  const totwData = useMemo(() => {
    const leaguePlayers = players.filter((p) => p.league === league);

    // Map each player to their GW rating
    const rated = leaguePlayers
      .map((p) => {
        const gwRecord = p.gameweeks[selectedGw];
        return {
          player: p,
          gwRating: gwRecord ? gwRecord.rating : p.seasonScore,
          opponent: gwRecord ? gwRecord.opponent : 'Match',
        };
      })
      .sort((a, b) => b.gwRating - a.gwRating);

    // Pick top 1 GK, top 4 DEF, top 3 MID, top 3 FWD
    const gks = rated.filter((item) => item.player.position === 'GK');
    const defs = rated.filter((item) => item.player.position === 'DEF');
    const mids = rated.filter((item) => item.player.position === 'MID');
    const fwds = rated.filter((item) => item.player.position === 'FWD');

    const topGk = gks[0] || rated[0];
    const topDefs = defs.slice(0, 4);
    const topMids = mids.slice(0, 3);
    const topFwds = fwds.slice(0, 3);

    const starting11 = [
      topGk,
      ...topDefs,
      ...topMids,
      ...topFwds,
    ].filter(Boolean);

    // Substitutes
    const subs = rated
      .filter((item) => !starting11.some((s) => s.player.id === item.player.id))
      .slice(0, 5);

    const teamAverageRating =
      starting11.length > 0
        ? (
            starting11.reduce((sum, item) => sum + item.gwRating, 0) / starting11.length
          ).toFixed(2)
        : '0.00';

    return {
      gk: topGk,
      defs: topDefs,
      mids: topMids,
      fwds: topFwds,
      subs,
      teamAverageRating,
    };
  }, [players, league, selectedGw]);

  // Card component for a player on the pitch
  const PitchPlayerNode = ({
    item,
    slotName,
  }: {
    item?: { player: Player; gwRating: number; opponent: string };
    slotName: string;
  }) => {
    if (!item) return <div className="w-20 h-24"></div>;
    const { player, gwRating } = item;

    return (
      <div
        onClick={() => onSelectPlayer(player)}
        className="flex flex-col items-center cursor-pointer group transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        <div className="relative">
          {/* Avatar Ring */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-900 shadow-xl shadow-emerald-950/60 ring-2 ring-white/20 group-hover:border-teal-300">
            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          </div>

          {/* Glowing Rating Tag */}
          <div className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-md bg-slate-950 text-emerald-400 border border-emerald-500/50 text-[10px] font-black font-mono shadow-md">
            {gwRating.toFixed(2)}
          </div>

          {/* Position Slot Label */}
          <div className="absolute -top-2 -left-1 px-1.5 py-0.2 rounded bg-emerald-600 text-[9px] font-bold text-slate-950 uppercase">
            {slotName}
          </div>
        </div>

        {/* Name and club tag */}
        <div className="mt-2 text-center max-w-[90px] sm:max-w-[110px]">
          <span className="block text-xs font-bold text-white truncate drop-shadow group-hover:text-emerald-300">
            {player.shortName}
          </span>
          <span className="block text-[10px] text-emerald-200/80 truncate">
            {player.teamShort}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">
              Tactical Team of the Week (4-3-3 Formation)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            The mathematically optimal starting 11 selected automatically by position-weighted ratings.
          </p>
        </div>

        {/* Gameweek Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            {[1, 2, 3, 4, 5, 6].map((gw) => (
              <button
                key={gw}
                onClick={() => setSelectedGw(gw)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGw === gw
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                GW {gw}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
            <span className="text-[10px] uppercase font-bold text-slate-400">Squad Avg Rating</span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              {totwData.teamAverageRating} ★
            </span>
          </div>
        </div>
      </div>

      {/* The Tactical Football Pitch */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[680px] rounded-3xl border-2 border-emerald-500/30 overflow-hidden shadow-2xl shadow-emerald-950/50 bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950 flex flex-col justify-between p-4 sm:p-8">
        
        {/* Pitch Turf Stripes & Markings */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,#064e3b,#064e3b_40px,#022c22_40px,#022c22_80px)]"></div>
        
        {/* Pitch Lines (SVG overlay) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none stroke-white/20 fill-none"
          strokeWidth="1.5"
        >
          {/* Halfway line */}
          <line x1="0" y1="50%" x2="100%" y2="50%" />
          {/* Center Circle */}
          <circle cx="50%" cy="50%" r="55" />
          <circle cx="50%" cy="50%" r="3" className="fill-white/30" />
          
          {/* Top Penalty Box (Opponent Side) */}
          <rect x="25%" y="0" width="50%" height="16%" />
          <rect x="37%" y="0" width="26%" height="6%" />

          {/* Bottom Penalty Box (Our Side) */}
          <rect x="25%" y="84%" width="50%" height="16%" />
          <rect x="37%" y="94%" width="26%" height="6%" />
          <circle cx="50%" cy="89%" r="3" className="fill-white/30" />
        </svg>

        {/* Tactical Positions Grid */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between py-2">
          
          {/* 1. Attackers (FWDs) - Top Tier */}
          <div className="flex items-center justify-around px-4 sm:px-12">
            <PitchPlayerNode item={totwData.fwds[1]} slotName="LW" />
            <PitchPlayerNode item={totwData.fwds[0]} slotName="ST" />
            <PitchPlayerNode item={totwData.fwds[2]} slotName="RW" />
          </div>

          {/* 2. Midfielders (MIDs) - Middle Tier */}
          <div className="flex items-center justify-around px-6 sm:px-20">
            <PitchPlayerNode item={totwData.mids[0]} slotName="LCM" />
            <PitchPlayerNode item={totwData.mids[1]} slotName="CM" />
            <PitchPlayerNode item={totwData.mids[2]} slotName="RCM" />
          </div>

          {/* 3. Defenders (DEFs) - Lower-middle Tier */}
          <div className="flex items-center justify-around px-2 sm:px-8">
            <PitchPlayerNode item={totwData.defs[0]} slotName="LB" />
            <PitchPlayerNode item={totwData.defs[1]} slotName="CB" />
            <PitchPlayerNode item={totwData.defs[2]} slotName="CB" />
            <PitchPlayerNode item={totwData.defs[3]} slotName="RB" />
          </div>

          {/* 4. Goalkeeper (GK) - Bottom Tier */}
          <div className="flex items-center justify-center">
            <PitchPlayerNode item={totwData.gk} slotName="GK" />
          </div>

        </div>

      </div>

      {/* Bench / Reserves Strip */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Team of the Week Bench (Top Contenders)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {totwData.subs.map(({ player, gwRating }) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-white truncate">{player.shortName}</span>
                <span className="block text-[10px] text-slate-400">{player.teamShort} • {player.position}</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {gwRating.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
