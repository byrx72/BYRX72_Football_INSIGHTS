'use client';

import React, { useState, useMemo } from 'react';
import { LeagueId } from '@/types/football';
import { ALL_TEAMS, ClubTeam } from '@/data/teamsData';
import { Search, Shield, MapPin, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface TeamsDirectoryProps {
  currentLeague: LeagueId;
  onLeagueChange: (league: LeagueId) => void;
  onSelectTeamForLeaderboard: (teamName: string) => void;
}

export const TeamsDirectory: React.FC<TeamsDirectoryProps> = ({
  currentLeague,
  onLeagueChange,
  onSelectTeamForLeaderboard,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTeams = useMemo(() => {
    return ALL_TEAMS.filter((t) => t.league === currentLeague).filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.stadium.toLowerCase().includes(q) ||
        t.manager.toLowerCase().includes(q) ||
        t.starPlayer.toLowerCase().includes(q)
      );
    });
  }, [currentLeague, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">
              Official League Directory ({currentLeague === 'PL' ? '20 Premier League Clubs' : '20 La Liga Clubs'})
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of European top-flight clubs evaluated by the Moneyball algorithmic framework.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* League Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => onLeagueChange('PL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentLeague === 'PL'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              <span>PL (20)</span>
            </button>

            <button
              onClick={() => onLeagueChange('LALIGA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentLeague === 'LALIGA'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇪🇸</span>
              <span>La Liga (20)</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search club, stadium, star..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of 20 Clubs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTeams.map((club) => (
          <div
            key={club.id}
            className="group relative p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
          >
            {/* Top Row: Crest & Code */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-14 h-14 p-2 rounded-2xl bg-slate-950/90 border border-slate-800/80 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={club.crest}
                  alt={club.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to shield icon if Wikipedia hotlink issues occur
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30">
                  {club.code}
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">Est. {club.founded}</span>
              </div>
            </div>

            {/* Club Information */}
            <div className="space-y-2 mb-4">
              <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                {club.name}
              </h3>

              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{club.stadium}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Cap: {club.capacity} • {club.manager}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Key Star:</span>
                <span className="font-semibold text-emerald-300">{club.starPlayer}</span>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => onSelectTeamForLeaderboard(club.shortName)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-300 group-hover:text-slate-950 bg-slate-950 group-hover:bg-emerald-400 border border-slate-800 group-hover:border-emerald-400 transition-all duration-200"
            >
              <span>View Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
