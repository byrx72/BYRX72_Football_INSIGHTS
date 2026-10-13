'use client';

import React, { useState } from 'react';
import { Player } from '@/types/football';
import { X, Trophy, Shield, Crosshair, Zap, Activity, Info } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { METRIC_LABELS } from '@/lib/scoringEngine';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
  const [selectedGw, setSelectedGw] = useState<number>(6);

  if (!player) return null;

  const gwRecord = player.gameweeks[selectedGw] || Object.values(player.gameweeks)[0];

  const radarData = [
    { subject: 'Attacking', value: player.radar.attacking },
    { subject: 'Creation', value: player.radar.creation },
    { subject: 'Retention', value: player.radar.retention },
    { subject: 'Defending', value: player.radar.defending },
    { subject: 'Physicality', value: player.radar.physicality },
    { subject: 'Match Impact', value: player.radar.matchImpact },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-emerald-950/40 overflow-hidden text-slate-100">
        
        {/* Top Header Card */}
        <div className="relative p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20 bg-slate-800 shrink-0">
              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
              <span className="absolute bottom-1 right-1 text-base">{player.flag}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {player.position} #{player.number}
                </span>
                <span className="text-xs text-slate-400">{player.team}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">{player.name}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Age: {player.age} • Market Value: {player.marketValue} • Nationality: {player.nationality}
              </p>
            </div>

            {/* Overall Season Score Box */}
            <div className="flex flex-col items-center sm:items-end justify-center bg-slate-950/80 border border-emerald-500/30 px-5 py-3 rounded-2xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Season Performance Score
              </span>
              <span className="text-3xl font-black text-emerald-400">
                {player.seasonScore.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-300/80">Running Algorithm Avg</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Radar Chart & Attribute Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Radar Chart */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Overall Dimension Profile
              </span>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Radar
                      name={player.name}
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.45}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Season Stats Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 block">
                  Season 2024/25 Core Metrics
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Goals / Assists</span>
                    <span className="text-base font-bold text-white">
                      {player.seasonStats.goals} G / {player.seasonStats.assists} A
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Key Passes</span>
                    <span className="text-base font-bold text-white">{player.seasonStats.keyPasses}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Pass Accuracy</span>
                    <span className="text-base font-bold text-white">{player.seasonStats.passAccuracyPct}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Tackles + Interceptions</span>
                    <span className="text-base font-bold text-white">
                      {player.seasonStats.tackles + player.seasonStats.interceptions}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Minutes Played</span>
                    <span className="text-base font-bold text-white">{player.seasonStats.minutes}&apos;</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Clean Sheets</span>
                    <span className="text-base font-bold text-white">{player.seasonStats.cleanSheets}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                <Info className="w-4 h-4 inline mr-1 text-emerald-400" />
                Score is computed via position weight matrix with diminishing returns on raw volume to eliminate goal bias.
              </div>
            </div>

          </div>

          {/* Gameweek Algorithmic Breakdown */}
          {gwRecord && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    Gameweek Mathematical Breakdown
                  </h4>
                  <p className="text-xs text-slate-400">
                    Opponent: {gwRecord.opponent} • Score Result: {gwRecord.scoreResult} • Opponent Multiplier: {gwRecord.opponentTier}x
                  </p>
                </div>

                {/* Gameweek selector pills */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {Object.keys(player.gameweeks).map((gwStr) => {
                    const gwNum = Number(gwStr);
                    return (
                      <button
                        key={gwNum}
                        onClick={() => setSelectedGw(gwNum)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                          selectedGw === gwNum
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        GW{gwNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table of subscores */}
              <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Metric</th>
                      <th className="py-2.5 px-2 text-center">Subscore (0-10)</th>
                      <th className="py-2.5 px-2 text-center">Weight</th>
                      <th className="py-2.5 px-3 text-right">Contribution to Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {Object.entries(gwRecord.breakdown).map(([metricKey, item]) => (
                      <tr key={metricKey} className="hover:bg-slate-800/20">
                        <td className="py-2 px-3 font-medium text-white">
                          {METRIC_LABELS[metricKey] || metricKey}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-emerald-400">
                          {item.subscore.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-400">
                          {(item.weight * 100).toFixed(0)}%
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-teal-300">
                          +{item.contribution.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                <span className="text-slate-400">
                  Calculated Gameweek Rating (with {gwRecord.opponentTier}x opponent factor):
                </span>
                <span className="text-base font-black text-emerald-400">
                  {gwRecord.rating.toFixed(2)} / 10.00
                </span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
