'use client';

import React from 'react';
import { LeagueId } from '@/types/football';
import {
  Trophy,
  Compass,
  GitCompare,
  Code2,
  Activity,
  Menu,
  Shield,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentLeague: LeagueId;
  onLeagueChange: (league: LeagueId) => void;
  currentView: 'landing' | 'app';
  onViewChange: (view: 'landing' | 'app') => void;
  activeTab: 'leaderboard' | 'totw' | 'compare' | 'teams';
  onTabChange: (tab: 'leaderboard' | 'totw' | 'compare' | 'teams') => void;
  onOpenAlgorithm: () => void;
  onOpenDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLeague,
  onLeagueChange,
  currentView,
  onViewChange,
  activeTab,
  onTabChange,
  onOpenAlgorithm,
  onOpenDrawer,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-stone-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-slate-950" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  BYRX72 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">INSIGHTS</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Moneyball v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-sans">
                The Algorithmic Football Intelligence Benchmark
              </p>
            </div>
          </div>

          {/* Center: League Switcher Pills */}
          <div className="hidden md:flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onLeagueChange('PL')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentLeague === 'PL'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              <span>Premier League</span>
            </button>

            <button
              onClick={() => onLeagueChange('LALIGA')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentLeague === 'LALIGA'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">🇪🇸</span>
              <span>La Liga</span>
            </button>
          </div>

          {/* Right Navigation & Toggle Buttons */}
          <div className="flex items-center gap-3">
            
            {/* View Switcher: Editorial Landing vs Live App */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => onViewChange('landing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'landing'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Editorial
              </button>

              <button
                onClick={() => {
                  onViewChange('app');
                  onTabChange('leaderboard');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'app' && activeTab === 'leaderboard'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                Leaderboards
              </button>

              <button
                onClick={() => {
                  onViewChange('app');
                  onTabChange('totw');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'app' && activeTab === 'totw'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                4-3-3 Pitch
              </button>

              <button
                onClick={() => {
                  onViewChange('app');
                  onTabChange('compare');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'app' && activeTab === 'compare'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                Radar
              </button>

              <button
                onClick={() => {
                  onViewChange('app');
                  onTabChange('teams');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'app' && activeTab === 'teams'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                20 Clubs
              </button>
            </div>

            {/* Inspect Algorithm Button */}
            <button
              onClick={onOpenAlgorithm}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:opacity-95 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Code2 className="w-4 h-4" />
              <span>Algorithm Matrix</span>
            </button>

            {/* Dynamic Hamburger Drawer Button */}
            <button
              onClick={onOpenDrawer}
              className="flex items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
            </button>

          </div>

        </div>

        {/* Mobile View Subbar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => onViewChange('landing')}
            className={`py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'landing' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
            }`}
          >
            Editorial
          </button>
          <button
            onClick={() => {
              onViewChange('app');
              onTabChange('leaderboard');
            }}
            className={`py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'app' && activeTab === 'leaderboard' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
            }`}
          >
            Rankings
          </button>
          <button
            onClick={() => {
              onViewChange('app');
              onTabChange('totw');
            }}
            className={`py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'app' && activeTab === 'totw' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
            }`}
          >
            4-3-3 Pitch
          </button>
          <button
            onClick={() => {
              onViewChange('app');
              onTabChange('compare');
            }}
            className={`py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'app' && activeTab === 'compare' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => {
              onViewChange('app');
              onTabChange('teams');
            }}
            className={`py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'app' && activeTab === 'teams' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
            }`}
          >
            20 Clubs
          </button>
        </div>

      </div>
    </header>
  );
};
