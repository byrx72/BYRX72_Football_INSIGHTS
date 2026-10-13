'use client';

import React, { useState, useMemo } from 'react';
import { Player, Position, LeagueId } from '@/types/football';
import { Search, Trophy, ArrowUpDown, Eye, Filter, Sparkles, Flame, ShieldAlert } from 'lucide-react';

interface LeaderboardTableProps {
  players: Player[];
  league: LeagueId;
  onSelectPlayer: (player: Player) => void;
  onOpenAlgorithm: () => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  league,
  onSelectPlayer,
  onOpenAlgorithm,
}) => {
  const [selectedGameweek, setSelectedGameweek] = useState<number | 'season'>('season');
  const [selectedPosition, setSelectedPosition] = useState<Position | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'score' | 'goals' | 'assists' | 'tackles'>('score');

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    return players
      .filter((p) => p.league === league)
      .filter((p) => {
        if (selectedPosition !== 'ALL' && p.position !== selectedPosition) return false;
        if (searchQuery.trim() === '') return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q)
        );
      })
      .map((p) => {
        // Calculate score for chosen view
        let displayScore = p.seasonScore;
        let gwRating: number | null = null;
        let gwOpponent: string | null = null;
        let gwGoals = p.seasonStats.goals;
        let gwAssists = p.seasonStats.assists;
        let gwKeyPasses = p.seasonStats.keyPasses;
        let gwTackles = p.seasonStats.tackles + p.seasonStats.interceptions;
        let gwPassAcc = p.seasonStats.passAccuracyPct;

        if (selectedGameweek !== 'season' && p.gameweeks[selectedGameweek]) {
          const gw = p.gameweeks[selectedGameweek];
          gwRating = gw.rating;
          displayScore = gw.rating;
          gwOpponent = gw.opponent;
          gwGoals = gw.stats.goals;
          gwAssists = gw.stats.assists;
          gwKeyPasses = gw.stats.keyPasses;
          gwTackles = gw.stats.tackles + gw.stats.interceptions;
          gwPassAcc = gw.stats.passAccuracyPct;
        }

        return {
          ...p,
          effectiveScore: displayScore,
          gwRating,
          gwOpponent,
          gwGoals,
          gwAssists,
          gwKeyPasses,
          gwTackles,
          gwPassAcc,
        };
      })
      .sort((a, b) => {
        if (sortField === 'score') return b.effectiveScore - a.effectiveScore;
        if (sortField === 'goals') return b.gwGoals - a.gwGoals;
        if (sortField === 'assists') return b.gwAssists - a.gwAssists;
        if (sortField === 'tackles') return b.gwTackles - a.gwTackles;
        return 0;
      });
  }, [players, league, selectedGameweek, selectedPosition, searchQuery, sortField]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
        
        {/* Gameweek Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedGameweek('season')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedGameweek === 'season'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Full Season 2024/25
          </button>
          {[1, 2, 3, 4, 5, 6].map((gw) => (
            <button
              key={gw}
              onClick={() => setSelectedGameweek(gw)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedGameweek === gw
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              GW {gw}
            </button>
          ))}
        </div>

        {/* Position Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          {(['ALL', 'FWD', 'MID', 'DEF', 'GK'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPosition === pos
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {pos === 'ALL' ? 'All Positions' : pos}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player or team..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

      </div>

      {/* Top 3 Featured Podium Cards (When Viewing Top Overall) */}
      {filteredPlayers.length >= 3 && selectedPosition === 'ALL' && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPlayers.slice(0, 3).map((player, idx) => {
            const rankLabel = idx === 0 ? '1st • Gold Leader' : idx === 1 ? '2nd • Silver' : '3rd • Bronze';
            const badgeGlow =
              idx === 0
                ? 'border-amber-400/50 shadow-amber-500/10 from-amber-950/30 to-slate-900'
                : idx === 1
                ? 'border-slate-300/40 shadow-slate-300/10 from-slate-800/40 to-slate-900'
                : 'border-amber-700/40 shadow-amber-700/10 from-amber-950/20 to-slate-900';

            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className={`relative p-5 rounded-3xl border bg-gradient-to-b ${badgeGlow} hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden shadow-xl group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    {rankLabel}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/30">
                    {player.position}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/20 bg-slate-800 shadow-md shrink-0">
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-xs">{player.flag}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-white truncate group-hover:text-emerald-400 transition-colors">
                      {player.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{player.team}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{player.gwGoals}G</span> • <span>{player.gwAssists}A</span> • <span>{player.gwPassAcc}% Pass</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                      {player.effectiveScore.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 w-14 text-center">Rank</th>
                <th className="py-4 px-4">Player & Club</th>
                <th className="py-4 px-3 text-center">Pos</th>
                <th
                  onClick={() => setSortField('score')}
                  className="py-4 px-4 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Performance Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => setSortField('goals')}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white"
                >
                  Goals
                </th>
                <th
                  onClick={() => setSortField('assists')}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white"
                >
                  Assists
                </th>
                <th className="py-4 px-3 text-center">Key Passes</th>
                <th
                  onClick={() => setSortField('tackles')}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white"
                >
                  Tackles+Int
                </th>
                <th className="py-4 px-3 text-center">Pass %</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPlayers.map((player, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                return (
                  <tr
                    key={player.id}
                    className="hover:bg-slate-800/40 transition-colors duration-150 group"
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-bold">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-300/20 text-slate-200 border border-slate-300/40 text-xs">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-700/20 text-amber-400 border border-amber-700/40 text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">{rank}</span>
                      )}
                    </td>

                    {/* Player Info */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onSelectPlayer(player)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {player.name}
                            </span>
                            <span className="text-xs">{player.flag}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{player.team}</span>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        player.position === 'FWD'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : player.position === 'MID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : player.position === 'DEF'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {player.position}
                      </span>
                    </td>

                    {/* Performance Score Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-emerald-500/40 shadow-inner">
                        <Flame className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                          {player.effectiveScore.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Goals */}
                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-200">
                      {player.gwGoals}
                    </td>

                    {/* Assists */}
                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-200">
                      {player.gwAssists}
                    </td>

                    {/* Key Passes */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      {player.gwKeyPasses}
                    </td>

                    {/* Tackles+Int */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      {player.gwTackles}
                    </td>

                    {/* Pass Acc */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      {player.gwPassAcc}%
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectPlayer(player)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-400 hover:text-slate-950 bg-emerald-500/10 hover:bg-emerald-400 border border-emerald-500/30 transition-all duration-150"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Math</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Showing {filteredPlayers.length} calibrated players for{' '}
              {selectedGameweek === 'season' ? 'Full Season 2024/25' : `Gameweek ${selectedGameweek}`}
            </span>
          </div>
          <button
            onClick={onOpenAlgorithm}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
          >
            How are these ratings computed? View Algorithm Breakdown →
          </button>
        </div>

      </div>

    </div>
  );
};
