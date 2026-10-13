'use client';

import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Scale, Award, ArrowRight, Sparkles } from 'lucide-react';
import { WEIGHT_MATRIX, calculateGameweekRating } from '@/lib/scoringEngine';
import { Position } from '@/types/football';

interface AlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmModal: React.FC<AlgorithmModalProps> = ({ isOpen, onClose }) => {
  const [testPosition, setTestPosition] = useState<Position>('MID');
  const [goals, setGoals] = useState<number>(1);
  const [assists, setAssists] = useState<number>(1);
  const [keyPasses, setKeyPasses] = useState<number>(3);
  const [passAcc, setPassAcc] = useState<number>(88);
  const [tackles, setTackles] = useState<number>(3);
  const [interceptions, setInterceptions] = useState<number>(2);
  const [cleanSheet, setCleanSheet] = useState<boolean>(true);
  const [saves, setSaves] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [opponentTier, setOpponentTier] = useState<number>(1.15);

  if (!isOpen) return null;

  const simulatedResult = calculateGameweekRating(
    testPosition,
    {
      goals,
      assists,
      keyPasses,
      passAccuracyPct: passAcc,
      tackles,
      interceptions,
      cleanSheet,
      saves,
      errorsLeadToGoal: errors,
      minutesPlayed: 90,
    },
    opponentTier
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/50 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                The Moneyball Algorithm Matrix
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Mathematical Model
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Position-adjusted, Per-90 normalized stats with opponent strength coefficients.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Key Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
                <Calculator className="w-4 h-4" />
                1. Per-90 Normalization
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raw statistics favor players with inflated minutes. Every in-match metric is normalized to a 90-minute standard:
              </p>
              <div className="mt-2 text-[11px] font-mono bg-slate-900 px-2 py-1 rounded text-emerald-300 border border-slate-800">
                Metric_p90 = (Metric / Min) × 90
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold mb-1">
                <Scale className="w-4 h-4" />
                2. Position Weight Matrix
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Goal bias is eliminated. Defenders are evaluated on duels & clean sheets; Midfielders on progressive passes & creation.
              </p>
              <div className="mt-2 text-[11px] font-mono bg-slate-900 px-2 py-1 rounded text-teal-300 border border-slate-800">
                Score = Σ (Subscore_i × Weight_pos)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                3. Opponent Context (Elo)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A brace vs. Man City or Real Madrid carries higher statistical weight than a brace against a 20th-place side.
              </p>
              <div className="mt-2 text-[11px] font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300 border border-slate-800">
                Final = BaseRating × OpponentTier (1.0x - 1.25x)
              </div>
            </div>
          </div>

          {/* Criteria Matrix Table */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Algorithmic Criteria Weights Matrix
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-3 text-center text-amber-400">Forward (FWD)</th>
                    <th className="py-3 px-3 text-center text-emerald-400">Midfielder (MID)</th>
                    <th className="py-3 px-3 text-center text-cyan-400">Defender (DEF)</th>
                    <th className="py-3 px-3 text-center text-indigo-400">Goalkeeper (GK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-white">Goals (Per 90)</td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-300">30%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-300">15%</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">5%</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-white">Assists (Per 90)</td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-300">20%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-300">25%</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">5%</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-white">Key Passes (Per 90)</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">10%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-300">25%</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">5%</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-white">Pass Accuracy %</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">5%</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">15%</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">10%</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">5%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-white">Tackles & Interceptions (Per 90)</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">5%</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">15%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-cyan-300">35%</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-white">Clean Sheet</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">5%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-cyan-300">20%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-indigo-300">30%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-white">Saves (Per 90)</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-indigo-300">40%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 text-rose-400">
                    <td className="py-2.5 px-4 font-medium">Errors Leading to Goal</td>
                    <td className="py-2.5 px-3 text-center">-10%</td>
                    <td className="py-2.5 px-3 text-center">-10%</td>
                    <td className="py-2.5 px-3 text-center">-15%</td>
                    <td className="py-2.5 px-3 text-center">-15%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Live Calculation Sandbox */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Live Formula Sandbox (Try it yourself!)</h4>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['FWD', 'MID', 'DEF', 'GK'] as Position[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setTestPosition(pos)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      testPosition === pos
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sliders */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Goals:</span> <span className="font-bold text-emerald-400">{goals}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={goals}
                    onChange={(e) => setGoals(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Assists:</span> <span className="font-bold text-emerald-400">{assists}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={assists}
                    onChange={(e) => setAssists(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Key Passes:</span> <span className="font-bold text-emerald-400">{keyPasses}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={keyPasses}
                    onChange={(e) => setKeyPasses(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Pass Accuracy %:</span> <span className="font-bold text-emerald-400">{passAcc}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={passAcc}
                    onChange={(e) => setPassAcc(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Tackles + Interceptions:</span>{' '}
                    <span className="font-bold text-emerald-400">{tackles + interceptions}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={tackles + interceptions}
                    onChange={(e) => {
                      const total = Number(e.target.value);
                      setTackles(Math.floor(total / 2));
                      setInterceptions(Math.ceil(total / 2));
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Opponent Tier:</span>{' '}
                    <span className="font-bold text-emerald-400">{opponentTier}x</span>
                  </div>
                  <select
                    value={opponentTier}
                    onChange={(e) => setOpponentTier(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value={1.25}>Tier 1 (Title Rival: Man City, Real Madrid) - 1.25x</option>
                    <option value={1.15}>Tier 2 (UCL Contenders: Liverpool, Atletico) - 1.15x</option>
                    <option value={1.08}>Tier 3 (Mid-table: Chelsea, Spurs, Sociedad) - 1.08x</option>
                    <option value={1.00}>Tier 4 (Bottom-half Teams) - 1.00x</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={cleanSheet}
                      onChange={(e) => setCleanSheet(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    Clean Sheet Kept
                  </label>
                </div>

                {testPosition === 'GK' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Saves:</span> <span className="font-bold text-emerald-400">{saves}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={saves}
                      onChange={(e) => setSaves(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Calculated Result Card */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Algorithmic Match Rating
                </span>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 my-2">
                  {simulatedResult.rating.toFixed(2)}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  simulatedResult.rating >= 8.5
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : simulatedResult.rating >= 7.5
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {simulatedResult.rating >= 8.5
                    ? '★ Man of the Match / World Class'
                    : simulatedResult.rating >= 7.5
                    ? 'Strong Impact Performance'
                    : 'Solid Contribution'}
                </span>
                <p className="text-[11px] text-slate-500 mt-3">
                  Calibrated for {testPosition} with {opponentTier}x context factor.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>Formula Engine: BYRX72 v2.4 (Python & TypeScript Verified)</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
