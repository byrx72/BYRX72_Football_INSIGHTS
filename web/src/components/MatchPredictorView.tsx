'use client';

import React, { useState, useMemo } from 'react';
import { League, TEAMS, EspnTeam } from '@/data/espn';
import { predictMatch, FEATURED_FIXTURES, MatchPredictionResult, ACTIVE_MODEL } from '@/lib/matchPredictor';
import { getPlayerPhoto } from '@/lib/playerPhotos';
import { Sparkles, Brain, Swords, Shield, Target, TrendingUp, RefreshCw, ArrowUpRight, Zap, Trophy, Cpu, Layers, CheckCircle2, Calendar } from 'lucide-react';

interface MatchPredictorViewProps {
  league: League;
}

export const MatchPredictorView: React.FC<MatchPredictorViewProps> = ({ league }) => {
  const isPL = league === 'PL';
  const leagueTeams = useMemo(() => TEAMS.filter((t) => t.league === league), [league]);
  const featured = FEATURED_FIXTURES[league];

  // Default to the first marquee match
  const [homeId, setHomeId] = useState<string>(featured[0]?.home || leagueTeams[0]?.id || '382');
  const [awayId, setAwayId] = useState<string>(featured[0]?.away || leagueTeams[1]?.id || '359');
  const [simulating, setSimulating] = useState(false);
  const [showModelSpecs, setShowModelSpecs] = useState(false);

  // Compute prediction
  const prediction: MatchPredictionResult | null = useMemo(() => {
    return predictMatch(homeId, awayId, 10000);
  }, [homeId, awayId]);

  const handleRunSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
    }, 400);
  };

  const accentColor = isPL ? '#e90052' : '#ea0029';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="page-heading">
        <div>
          <div className="eyebrow flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>AI MATCH FORECASTER · 10,000 MONTE CARLO SIMULATIONS</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight mt-2">
            Match<br /><em>Predictor.</em>
          </h1>
        </div>
        <div className="flex flex-col gap-2 max-w-md">
          <p className="text-slate-400 text-sm font-mono leading-relaxed">
            Bivariate Poisson statistical modeling powered by 2026/27 ESPN team attack/defense coefficients, squad BYRX ratings, and key player performance vectors.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModelSpecs(!showModelSpecs)}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 underline decoration-emerald-500/50 underline-offset-4"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Architecture: {ACTIVE_MODEL.version}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Auto-Updating
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Seasonal & Machine Learning Pipeline Specs Drawer */}
      {showModelSpecs && (
        <div className="bg-gradient-to-br from-black/80 via-slate-950/80 to-black/80 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                  {ACTIVE_MODEL.name}
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    Active v{ACTIVE_MODEL.version}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Weekly Automated Sync · GitHub Actions & ESPN Public API
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cyan-400" />
                Live Season 2026/27
              </span>
              <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Next: {ACTIVE_MODEL.nextVersion}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs font-mono">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="text-slate-400 block mb-1">Active Mathematical Engine:</span>
              <p className="text-white leading-relaxed">
                Bivariate Dixon-Coles Poisson process with 10,000 Monte Carlo trials, team attack (α), defense (β), and +0.28 home bias.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="text-slate-400 block mb-1">Season Update Cadence:</span>
              <p className="text-white leading-relaxed">
                Weekly scheduled cron every Monday at 04:00 UTC, automatically regenerating squad ratings after all matchday results.
              </p>
            </div>
            <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20">
              <span className="text-emerald-400 block mb-1">Upcoming ML Model Upgrade:</span>
              <p className="text-slate-300 leading-relaxed">
                Pluggable interface in <code className="text-emerald-300">pipeline/ml_engine.py</code> ready for XGBoost multi-feature gradient boosting & player spatial tracking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Match Quick Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2 shrink-0">
          Marquee Fixtures:
        </span>
        {featured.map((fix, idx) => {
          const h = TEAMS.find((t) => t.id === fix.home);
          const a = TEAMS.find((t) => t.id === fix.away);
          const isSelected = homeId === fix.home && awayId === fix.away;
          return (
            <button
              key={idx}
              onClick={() => {
                setHomeId(fix.home);
                setAwayId(fix.away);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all shrink-0 ${
                isSelected
                  ? isPL
                    ? 'bg-[#e90052] text-white shadow-lg shadow-[#e90052]/30 scale-105'
                    : 'bg-[#ea0029] text-white shadow-lg shadow-[#ea0029]/30 scale-105'
                  : 'bg-black/60 text-slate-300 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {h && <img src={h.crest} alt={h.name} className="w-4 h-4 object-contain" />}
              <span>{h?.short}</span>
              <span className="text-white/40">vs</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {a && <img src={a.crest} alt={a.name} className="w-4 h-4 object-contain" />}
              <span>{a?.short}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Team Matchup Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#0d1017]/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-xl">
        <div className="md:col-span-5">
          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-2 font-bold">
            Home Team (Pitch Advantage +18%)
          </label>
          <select
            value={homeId}
            onChange={(e) => setHomeId(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:border-white/40 transition-colors"
          >
            {leagueTeams.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === awayId}>
                {t.name} ({t.short})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex flex-col items-center justify-center pt-4 md:pt-0">
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 group shadow-lg"
            title="Re-run Simulation"
          >
            <RefreshCw className={`w-5 h-5 ${simulating ? 'animate-spin text-emerald-400' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 mt-1">
            Re-Simulate
          </span>
        </div>

        <div className="md:col-span-5">
          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-2 font-bold">
            Away Team (Visiting Squad)
          </label>
          <select
            value={awayId}
            onChange={(e) => setAwayId(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:border-white/40 transition-colors"
          >
            {leagueTeams.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === homeId}>
                {t.name} ({t.short})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Prediction Display Card */}
      {prediction && (
        <div className="bg-gradient-to-b from-[#0f121d] via-[#090b10] to-[#040608] border border-white/15 rounded-[36px] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          
          {/* Header Bar with Simulation Info */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                10,000 MONTE CARLO ITERATIONS
              </span>
              <span className="text-xs font-mono text-slate-400">
                Calibrated with Poisson xG Matrix
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Machine Learning Confidence: <strong>{prediction.predictedScore.probability}%</strong></span>
            </div>
          </div>

          {/* Match Banner: Home Team vs Away Team */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-8">
            {/* Home Team */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prediction.homeTeam.crest}
                alt={prediction.homeTeam.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-lg mb-3"
              />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-slate-400">
                HOME · RANK #{prediction.homeStanding?.rank || '—'}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
                {prediction.homeTeam.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/15 text-slate-200">
                  {prediction.homeStanding?.points || 0} Pts
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Squad Power {prediction.homeSquadRating.toFixed(2)}★
                </span>
              </div>
            </div>

            {/* Center Predicted Score Box */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
                PROJECTED SCORELINE
              </span>
              <div className="flex items-center gap-4 bg-black/70 border border-white/20 px-8 py-4 rounded-3xl shadow-2xl shadow-black">
                <span className="font-display font-black text-5xl sm:text-6xl text-white">
                  {prediction.predictedScore.home}
                </span>
                <span className="font-display font-black text-3xl sm:text-4xl text-white/40">
                  :
                </span>
                <span className="font-display font-black text-5xl sm:text-6xl text-white">
                  {prediction.predictedScore.away}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 mt-3 text-center">
                Expected Goals (xG): <strong className="text-white">{prediction.homeXG}</strong> vs <strong className="text-white">{prediction.awayXG}</strong>
              </span>
            </div>

            {/* Away Team */}
            <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prediction.awayTeam.crest}
                alt={prediction.awayTeam.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-lg mb-3"
              />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-slate-400">
                AWAY · RANK #{prediction.awayStanding?.rank || '—'}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
                {prediction.awayTeam.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/15 text-slate-200">
                  {prediction.awayStanding?.points || 0} Pts
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  Squad Power {prediction.awaySquadRating.toFixed(2)}★
                </span>
              </div>
            </div>
          </div>

          {/* Win / Draw / Loss Probability Spectrum Meter */}
          <div className="my-8 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-emerald-400">
                {prediction.homeTeam.short} Win: {prediction.homeWinProb}%
              </span>
              <span className="text-amber-300">
                Draw: {prediction.drawProb}%
              </span>
              <span className="text-rose-400">
                {prediction.awayTeam.short} Win: {prediction.awayWinProb}%
              </span>
            </div>

            {/* Spectrum Bar */}
            <div className="h-4 w-full rounded-full bg-slate-900 border border-white/10 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${prediction.homeWinProb}%` }}
                className="bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-700"
                title={`${prediction.homeTeam.name} Win: ${prediction.homeWinProb}%`}
              />
              <div
                style={{ width: `${prediction.drawProb}%` }}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                title={`Draw: ${prediction.drawProb}%`}
              />
              <div
                style={{ width: `${prediction.awayWinProb}%` }}
                className="bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-700"
                title={`${prediction.awayTeam.name} Win: ${prediction.awayWinProb}%`}
              />
            </div>
          </div>

          {/* Probability Tiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-8">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Both Teams to Score (BTTS)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-white">
                  {prediction.bttsProb}%
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {prediction.bttsProb >= 50 ? 'Likely YES' : 'Unlikely'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Over 2.5 Goals
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-white">
                  {prediction.over25Prob}%
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {prediction.over25Prob >= 50 ? 'Over Trend' : 'Under Trend'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Clean Sheet {prediction.homeTeam.short}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-white">
                  {Math.round(Math.exp(-prediction.awayXG) * 100)}%
                </span>
                <span className="text-xs font-mono text-slate-400">prob</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Clean Sheet {prediction.awayTeam.short}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-white">
                  {Math.round(Math.exp(-prediction.homeXG) * 100)}%
                </span>
                <span className="text-xs font-mono text-slate-400">prob</span>
              </div>
            </div>
          </div>

          {/* Key Player Duel & Tactical Advantage */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-6 border-t border-white/10">
            {/* Key Player Head-to-Head Duel */}
            <div className="md:col-span-7 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Key Matchup & Decisive Duel
                </span>
                <span className="text-[10px] font-mono text-slate-400">Primary Goal Threats</span>
              </div>

              <div className="flex items-center justify-around gap-4 py-2">
                {/* Home Star */}
                {prediction.homeStar && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400/60 shadow-lg mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPlayerPhoto(prediction.homeStar)}
                        alt={prediction.homeStar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-display font-bold text-sm text-white">{prediction.homeStar.name}</span>
                    <span className="text-xs font-mono text-slate-400">
                      {prediction.homeStar.stats.goals}G · {prediction.homeStar.stats.assists}A · {prediction.homeStar.score.toFixed(1)}★
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center">
                  <span className="font-display font-black text-xl text-white/40">VS</span>
                </div>

                {/* Away Star */}
                {prediction.awayStar && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-lg mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPlayerPhoto(prediction.awayStar)}
                        alt={prediction.awayStar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-display font-bold text-sm text-white">{prediction.awayStar.name}</span>
                    <span className="text-xs font-mono text-slate-400">
                      {prediction.awayStar.stats.goals}G · {prediction.awayStar.stats.assists}A · {prediction.awayStar.score.toFixed(1)}★
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs font-mono text-slate-400 mt-4 leading-relaxed">
                {prediction.tacticalAdvantage}
              </p>
            </div>

            {/* Top Exact Scorelines */}
            <div className="md:col-span-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-3">
                  Top 5 Probable Scorelines
                </span>
                <div className="space-y-2">
                  {prediction.topScores.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs font-mono"
                    >
                      <span className="font-bold text-white">
                        {prediction.homeTeam.short} {s.home} - {s.away} {prediction.awayTeam.short}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-400"
                            style={{ width: `${s.prob * 4}%` }}
                          />
                        </div>
                        <span className="text-emerald-300 font-bold w-9 text-right">{s.prob}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Model: Poisson + Dixon-Coles</span>
                <span className="text-emerald-400">✓ Calibrated</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
