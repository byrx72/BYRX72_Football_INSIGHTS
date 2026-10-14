'use client';

import React, { useState } from 'react';
import { LeagueId, Player } from '@/types/football';
import { PLAYERS, LEAGUES } from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { LuxuryLandingPage } from '@/components/LuxuryLandingPage';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { TeamOfTheWeek } from '@/components/TeamOfTheWeek';
import { RadarComparison } from '@/components/RadarComparison';
import { TeamsDirectory } from '@/components/TeamsDirectory';
import { DynamicDrawer } from '@/components/DynamicDrawer';
import { PlayerDetailModal } from '@/components/PlayerDetailModal';
import { AlgorithmModal } from '@/components/AlgorithmModal';
import {
  Trophy,
  Compass,
  GitCompare,
  Code2,
  Sparkles,
  Database,
  Cpu,
  Award,
  Shield,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function Home() {
  const [currentLeague, setCurrentLeague] = useState<LeagueId>('PL');
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'totw' | 'compare' | 'teams'>('leaderboard');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isAlgorithmOpen, setIsAlgorithmOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const leagueMeta = LEAGUES[currentLeague];
  const leaguePlayers = PLAYERS.filter((p) => p.league === currentLeague);
  const topPlayer = [...leaguePlayers].sort((a, b) => b.seasonScore - a.seasonScore)[0] || PLAYERS[0];

  const handleSelectTeamForLeaderboard = (teamName: string) => {
    setCurrentView('app');
    setActiveTab('leaderboard');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Dynamic Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentLeague={currentLeague}
        onLeagueChange={setCurrentLeague}
        currentView={currentView}
        onViewChange={setCurrentView}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAlgorithm={() => setIsAlgorithmOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* SECTION 1: Luxury Editorial Landing Page (Always Present) */}
        <div id="landing-hero">
          <LuxuryLandingPage
            currentLeague={currentLeague}
            onLeagueChange={setCurrentLeague}
            onNavigateToApp={(tab) => {
              setActiveTab(tab);
              const element = document.getElementById('analytics-suite');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onOpenAlgorithm={() => setIsAlgorithmOpen(true)}
            players={PLAYERS}
            onSelectPlayer={setSelectedPlayer}
          />
        </div>

        {/* SECTION 2: Live 2026/27 Interactive Analytics Console & Leaderboard Suite */}
        <div id="analytics-suite" className="space-y-8 pt-8 border-t border-stone-800 scroll-mt-24">
          
          {/* App View Header Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-950 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{leagueMeta.flag}</span>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                    {leagueMeta.name} • Matchweek {leagueMeta.currentGameweek} Live (2026/27 Season)
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
                  European Football Intelligence Suite
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Position-adjusted performance ratings normalized to per-90 metrics with dynamic opponent context multipliers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAlgorithmOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Inspect Formula</span>
                </button>
              </div>
            </div>
          </section>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'leaderboard'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>2026/27 Leaderboard</span>
              </button>

              <button
                onClick={() => setActiveTab('totw')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'totw'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Tactical Pitch (4-3-3)</span>
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'compare'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>Head-to-Head Radar</span>
              </button>

              <button
                onClick={() => setActiveTab('teams')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'teams'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>All 20 {currentLeague === 'PL' ? 'PL' : 'La Liga'} Clubs</span>
              </button>
            </div>
          </div>

          {/* Active Tab Screen */}
          <section>
            {activeTab === 'leaderboard' && (
              <LeaderboardTable
                players={PLAYERS}
                league={currentLeague}
                onSelectPlayer={setSelectedPlayer}
                onOpenAlgorithm={() => setIsAlgorithmOpen(true)}
              />
            )}

            {activeTab === 'totw' && (
              <TeamOfTheWeek
                players={PLAYERS}
                league={currentLeague}
                onSelectPlayer={setSelectedPlayer}
              />
            )}

            {activeTab === 'compare' && (
              <RadarComparison
                players={PLAYERS}
                onSelectPlayer={setSelectedPlayer}
              />
            )}

            {activeTab === 'teams' && (
              <TeamsDirectory
                currentLeague={currentLeague}
                onLeagueChange={setCurrentLeague}
                onSelectTeamForLeaderboard={handleSelectTeamForLeaderboard}
              />
            )}
          </section>
        </div>

        {/* Recruiter & System Architecture Section (Shared Footer Block) */}
        <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-emerald-400 tracking-wider">
                Recruiter & Portfolio Showcase Architecture
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Full-Stack System Architecture & Data Engineering
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Python ETL → PostgreSQL → Next.js App Router</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                1. Data Extraction & Pipeline
              </div>
              <p className="text-slate-400 leading-relaxed">
                Python ingest script connects to API-Football endpoints, paginating and caching match fixture statistics with automated weekly cron jobs.
              </p>
              <div className="font-mono text-[11px] text-emerald-300/80 pt-1">
                pipeline/algorithm.py
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                2. Algorithmic Transformation
              </div>
              <p className="text-slate-400 leading-relaxed">
                Normalizes statistics to Per-90 standardizing, applies diminishing returns, positional weighting matrices, and opponent Elo multipliers.
              </p>
              <div className="font-mono text-[11px] text-teal-300/80 pt-1">
                Score: 1.00 to 10.00 Calibrated
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Award className="w-4 h-4" />
                3. UI & Visual Intelligence
              </div>
              <p className="text-slate-400 leading-relaxed">
                Next.js App Router with Tailwind CSS, Recharts multi-polygon Spider Radar comparison, and a tactical 4-3-3 pitch board.
              </p>
              <div className="font-mono text-[11px] text-cyan-300/80 pt-1">
                Recharts + Tailwind CSS
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-stone-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026/27 BYRX72 Football Insights. Built for LinkedIn Portfolio &amp; Algorithmic Showcase.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsAlgorithmOpen(true)} className="hover:text-emerald-400 transition-colors">
              Algorithm Specs
            </button>
            <span>•</span>
            <span className="text-slate-500">Premier League & La Liga EA Sports</span>
          </div>
        </div>
      </footer>

      {/* Dynamic Slide-out Toggle Menu Drawer */}
      <DynamicDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentLeague={currentLeague}
        onLeagueChange={setCurrentLeague}
        currentView={currentView}
        onViewChange={setCurrentView}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAlgorithm={() => setIsAlgorithmOpen(true)}
      />

      {/* Modals */}
      <PlayerDetailModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />

      <AlgorithmModal
        isOpen={isAlgorithmOpen}
        onClose={() => setIsAlgorithmOpen(false)}
      />

    </div>
  );
}
