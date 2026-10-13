'use client';

import React from 'react';
import { LeagueId } from '@/types/football';
import { X, Trophy, Compass, GitCompare, Code2, Shield, Activity, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

interface DynamicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLeague: LeagueId;
  onLeagueChange: (league: LeagueId) => void;
  currentView: 'landing' | 'app';
  onViewChange: (view: 'landing' | 'app') => void;
  activeTab: 'leaderboard' | 'totw' | 'compare' | 'teams';
  onTabChange: (tab: 'leaderboard' | 'totw' | 'compare' | 'teams') => void;
  onOpenAlgorithm: () => void;
}

export const DynamicDrawer: React.FC<DynamicDrawerProps> = ({
  isOpen,
  onClose,
  currentLeague,
  onLeagueChange,
  currentView,
  onViewChange,
  activeTab,
  onTabChange,
  onOpenAlgorithm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-md h-full bg-gradient-to-b from-stone-950 via-slate-950 to-emerald-950/60 border-l border-emerald-500/20 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 text-slate-100">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md shadow-emerald-500/20 text-slate-950">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white font-sans">
                  BYRX72 <span className="text-emerald-400">INSIGHTS</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                  Menu & Quick Navigation
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* League Selector inside Drawer */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-2.5">
              Select Active League
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onLeagueChange('PL')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  currentLeague === 'PL'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                <span>Premier League</span>
              </button>

              <button
                onClick={() => onLeagueChange('LALIGA')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  currentLeague === 'LALIGA'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🇪🇸</span>
                <span>La Liga</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold block px-2 mb-2">
              Platform Views
            </span>

            <button
              onClick={() => {
                onViewChange('landing');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                currentView === 'landing'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="block text-sm">Editorial Landing Page</span>
                  <span className="text-[10px] font-normal text-slate-400">Atmospheric luxury overview</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onViewChange('app');
                onTabChange('leaderboard');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                currentView === 'app' && activeTab === 'leaderboard'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <span className="block text-sm">Leaderboards & Rankings</span>
                  <span className="text-[10px] font-normal text-slate-400">Weekly & season algorithmic scores</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onViewChange('app');
                onTabChange('totw');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                currentView === 'app' && activeTab === 'totw'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-teal-400" />
                <div className="text-left">
                  <span className="block text-sm">Tactical 4-3-3 Pitch View</span>
                  <span className="text-[10px] font-normal text-slate-400">Optimal starting XI visualization</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onViewChange('app');
                onTabChange('compare');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                currentView === 'app' && activeTab === 'compare'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <GitCompare className="w-4 h-4 text-sky-400" />
                <div className="text-left">
                  <span className="block text-sm">Head-to-Head Spider Radar</span>
                  <span className="text-[10px] font-normal text-slate-400">Multi-dimensional player comparison</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onViewChange('app');
                onTabChange('teams');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                currentView === 'app' && activeTab === 'teams'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="block text-sm">All 20 League Clubs</span>
                  <span className="text-[10px] font-normal text-slate-400">Official crests & stadiums</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <button
            onClick={() => {
              onClose();
              onOpenAlgorithm();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Code2 className="w-4 h-4" />
            <span>Inspect Algorithmic Model</span>
          </button>

          <p className="text-[10px] text-center text-slate-500 font-mono">
            BYRX72 Football Insights v2.4 • Premier League & La Liga
          </p>
        </div>

      </div>
    </div>
  );
};
