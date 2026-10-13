'use client';

import React, { useState } from 'react';
import { Player } from '@/types/football';
import { GitCompare, Trophy, Zap, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';

interface RadarComparisonProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const RadarComparison: React.FC<RadarComparisonProps> = ({ players, onSelectPlayer }) => {
  const [playerAId, setPlayerAId] = useState<string>(players[0]?.id || 'pl-haaland');
  const [playerBId, setPlayerBId] = useState<string>(players[6]?.id || 'la-vinicius');

  const playerA = players.find((p) => p.id === playerAId) || players[0];
  const playerB = players.find((p) => p.id === playerBId) || players[1];

  const radarData = [
    {
      subject: 'Attacking Threat',
      [playerA.shortName]: playerA.radar.attacking,
      [playerB.shortName]: playerB.radar.attacking,
      fullMark: 100,
    },
    {
      subject: 'Vision & Creation',
      [playerA.shortName]: playerA.radar.creation,
      [playerB.shortName]: playerB.radar.creation,
      fullMark: 100,
    },
    {
      subject: 'Ball Retention',
      [playerA.shortName]: playerA.radar.retention,
      [playerB.shortName]: playerB.radar.retention,
      fullMark: 100,
    },
    {
      subject: 'Defending Impact',
      [playerA.shortName]: playerA.radar.defending,
      [playerB.shortName]: playerB.radar.defending,
      fullMark: 100,
    },
    {
      subject: 'Physicality & Duels',
      [playerA.shortName]: playerA.radar.physicality,
      [playerB.shortName]: playerB.radar.physicality,
      fullMark: 100,
    },
    {
      subject: 'Match Impact Score',
      [playerA.shortName]: playerA.radar.matchImpact,
      [playerB.shortName]: playerB.radar.matchImpact,
      fullMark: 100,
    },
  ];

  // Quick Preset Matches
  const presets = [
    { name: 'Haaland vs Vinícius Jr', idA: 'pl-haaland', idB: 'la-vinicius' },
    { name: 'Saka vs Lamine Yamal', idA: 'pl-saka', idB: 'la-yamal' },
    { name: 'Rodri vs Bellingham', idA: 'pl-rodri', idB: 'la-bellingham' },
    { name: 'Saliba vs Rüdiger', idA: 'pl-saliba', idB: 'la-rudiger' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Match Presets */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white">
                Head-to-Head Algorithmic Radar Comparison
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare any two superstars across Premier League and La Liga using standardized radar dimensions.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Popular:
            </span>
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setPlayerAId(preset.idA);
                  setPlayerBId(preset.idB);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all shrink-0"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Player A Selector Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/40 shadow-xl shadow-emerald-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Player A (Emerald Line)
            </span>
            <select
              value={playerAId}
              onChange={(e) => setPlayerAId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.teamShort} • {p.position})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-800 shrink-0">
              <img src={playerA.avatar} alt={playerA.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{playerA.name}</span>
                <span className="text-sm">{playerA.flag}</span>
              </div>
              <p className="text-xs text-slate-400">{playerA.team} • {playerA.position}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {playerA.seasonScore.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block">Season Score</span>
            </div>
          </div>
        </div>

        {/* Player B Selector Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-sky-500/40 shadow-xl shadow-sky-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              Player B (Sky Blue Line)
            </span>
            <select
              value={playerBId}
              onChange={(e) => setPlayerBId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.teamShort} • {p.position})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-400 bg-slate-800 shrink-0">
              <img src={playerB.avatar} alt={playerB.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{playerB.name}</span>
                <span className="text-sm">{playerB.flag}</span>
              </div>
              <p className="text-xs text-slate-400">{playerB.team} • {playerB.position}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-sky-400 font-mono">
                {playerB.seasonScore.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block">Season Score</span>
            </div>
          </div>
        </div>

      </div>

      {/* Spider Chart & Attribute Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Spider Chart Canvas */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center min-h-[420px]">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Multi-Dimensional Radar Overlay
          </span>
          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Radar
                  name={playerA.shortName}
                  dataKey={playerA.shortName}
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Radar
                  name={playerB.shortName}
                  dataKey={playerB.shortName}
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.4}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span className="text-xs font-bold text-slate-200">{value}</span>}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Head-to-Head Stat Comparison Bars */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Direct Metric Showdown
            </h3>

            <div className="space-y-4 text-xs">
              
              {/* Goals */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${playerA.seasonStats.goals >= playerB.seasonStats.goals ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerA.seasonStats.goals}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Goals Scored</span>
                  <span className={`font-bold ${playerB.seasonStats.goals >= playerA.seasonStats.goals ? 'text-sky-400' : 'text-slate-400'}`}>
                    {playerB.seasonStats.goals}
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    style={{
                      width: `${(playerA.seasonStats.goals / Math.max(1, playerA.seasonStats.goals + playerB.seasonStats.goals)) * 100}%`,
                    }}
                    className="bg-emerald-500"
                  />
                  <div
                    style={{
                      width: `${(playerB.seasonStats.goals / Math.max(1, playerA.seasonStats.goals + playerB.seasonStats.goals)) * 100}%`,
                    }}
                    className="bg-sky-500"
                  />
                </div>
              </div>

              {/* Assists */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${playerA.seasonStats.assists >= playerB.seasonStats.assists ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerA.seasonStats.assists}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Assists</span>
                  <span className={`font-bold ${playerB.seasonStats.assists >= playerA.seasonStats.assists ? 'text-sky-400' : 'text-slate-400'}`}>
                    {playerB.seasonStats.assists}
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    style={{
                      width: `${(playerA.seasonStats.assists / Math.max(1, playerA.seasonStats.assists + playerB.seasonStats.assists)) * 100}%`,
                    }}
                    className="bg-emerald-500"
                  />
                  <div
                    style={{
                      width: `${(playerB.seasonStats.assists / Math.max(1, playerA.seasonStats.assists + playerB.seasonStats.assists)) * 100}%`,
                    }}
                    className="bg-sky-500"
                  />
                </div>
              </div>

              {/* Key Passes */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${playerA.seasonStats.keyPasses >= playerB.seasonStats.keyPasses ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerA.seasonStats.keyPasses}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Key Passes</span>
                  <span className={`font-bold ${playerB.seasonStats.keyPasses >= playerA.seasonStats.keyPasses ? 'text-sky-400' : 'text-slate-400'}`}>
                    {playerB.seasonStats.keyPasses}
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    style={{
                      width: `${(playerA.seasonStats.keyPasses / Math.max(1, playerA.seasonStats.keyPasses + playerB.seasonStats.keyPasses)) * 100}%`,
                    }}
                    className="bg-emerald-500"
                  />
                  <div
                    style={{
                      width: `${(playerB.seasonStats.keyPasses / Math.max(1, playerA.seasonStats.keyPasses + playerB.seasonStats.keyPasses)) * 100}%`,
                    }}
                    className="bg-sky-500"
                  />
                </div>
              </div>

              {/* Tackles + Interceptions */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${playerA.seasonStats.tackles + playerA.seasonStats.interceptions >= playerB.seasonStats.tackles + playerB.seasonStats.interceptions ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerA.seasonStats.tackles + playerA.seasonStats.interceptions}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Tackles & Interceptions</span>
                  <span className={`font-bold ${playerB.seasonStats.tackles + playerB.seasonStats.interceptions >= playerA.seasonStats.tackles + playerA.seasonStats.interceptions ? 'text-sky-400' : 'text-slate-400'}`}>
                    {playerB.seasonStats.tackles + playerB.seasonStats.interceptions}
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    style={{
                      width: `${((playerA.seasonStats.tackles + playerA.seasonStats.interceptions) / Math.max(1, (playerA.seasonStats.tackles + playerA.seasonStats.interceptions) + (playerB.seasonStats.tackles + playerB.seasonStats.interceptions))) * 100}%`,
                    }}
                    className="bg-emerald-500"
                  />
                  <div
                    style={{
                      width: `${((playerB.seasonStats.tackles + playerB.seasonStats.interceptions) / Math.max(1, (playerA.seasonStats.tackles + playerA.seasonStats.interceptions) + (playerB.seasonStats.tackles + playerB.seasonStats.interceptions))) * 100}%`,
                    }}
                    className="bg-sky-500"
                  />
                </div>
              </div>

              {/* Pass Accuracy */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${playerA.seasonStats.passAccuracyPct >= playerB.seasonStats.passAccuracyPct ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerA.seasonStats.passAccuracyPct}%
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Pass Accuracy</span>
                  <span className={`font-bold ${playerB.seasonStats.passAccuracyPct >= playerA.seasonStats.passAccuracyPct ? 'text-sky-400' : 'text-slate-400'}`}>
                    {playerB.seasonStats.passAccuracyPct}%
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    style={{
                      width: `${(playerA.seasonStats.passAccuracyPct / (playerA.seasonStats.passAccuracyPct + playerB.seasonStats.passAccuracyPct)) * 100}%`,
                    }}
                    className="bg-emerald-500"
                  />
                  <div
                    style={{
                      width: `${(playerB.seasonStats.passAccuracyPct / (playerA.seasonStats.passAccuracyPct + playerB.seasonStats.passAccuracyPct)) * 100}%`,
                    }}
                    className="bg-sky-500"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Algorithmic Verdict Box */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              Scout Analytics Verdict:
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {playerA.seasonScore > playerB.seasonScore
                ? `${playerA.name} currently holds higher algorithmic efficiency (+${(playerA.seasonScore - playerB.seasonScore).toFixed(2)}) thanks to opponent-adjusted rating weighting.`
                : `${playerB.name} currently leads (+${(playerB.seasonScore - playerA.seasonScore).toFixed(2)}) based on position-calibrated contribution.`}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
