import { Position, GameweekStats, MetricBreakdownItem } from '@/types/football';

export const WEIGHT_MATRIX: Record<Position, Record<string, number>> = {
  FWD: {
    goals_p90: 0.30,
    assists_p90: 0.20,
    key_passes_p90: 0.10,
    pass_accuracy: 0.05,
    interceptions_tackles_p90: 0.05,
    clean_sheet: 0.00,
    saves_p90: 0.00,
    errors_lead_to_goal: -0.10,
  },
  MID: {
    goals_p90: 0.15,
    assists_p90: 0.25,
    key_passes_p90: 0.25,
    pass_accuracy: 0.15,
    interceptions_tackles_p90: 0.15,
    clean_sheet: 0.05,
    saves_p90: 0.00,
    errors_lead_to_goal: -0.10,
  },
  DEF: {
    goals_p90: 0.05,
    assists_p90: 0.05,
    key_passes_p90: 0.05,
    pass_accuracy: 0.10,
    interceptions_tackles_p90: 0.35,
    clean_sheet: 0.20,
    saves_p90: 0.00,
    errors_lead_to_goal: -0.15,
  },
  GK: {
    goals_p90: 0.00,
    assists_p90: 0.00,
    key_passes_p90: 0.00,
    pass_accuracy: 0.05,
    interceptions_tackles_p90: 0.00,
    clean_sheet: 0.30,
    saves_p90: 0.40,
    errors_lead_to_goal: -0.15,
  },
};

export const BENCHMARKS = {
  goals_p90: 1.10,
  assists_p90: 0.70,
  key_passes_p90: 3.80,
  interceptions_tackles_p90: 5.50,
  saves_p90: 6.00,
};

export const METRIC_LABELS: Record<string, string> = {
  goals_p90: 'Goals (Per 90)',
  assists_p90: 'Assists (Per 90)',
  key_passes_p90: 'Key Passes (Per 90)',
  pass_accuracy: 'Pass Accuracy %',
  interceptions_tackles_p90: 'Tackles + Int (Per 90)',
  clean_sheet: 'Clean Sheet Bonus',
  saves_p90: 'Saves (Per 90)',
  errors_lead_to_goal: 'Errors Leading to Goal',
};

export function normalizeMetric(val: number, benchmark: number): number {
  if (benchmark <= 0) return 0;
  const ratio = val / benchmark;
  return Math.min(10.0, Math.max(0.0, ratio * 10.0));
}

export function normalizePassAcc(accuracyPct: number): number {
  const baseline = 65.0;
  const ceiling = 95.0;
  if (accuracyPct <= baseline) return 0.0;
  return Math.min(10.0, ((accuracyPct - baseline) / (ceiling - baseline)) * 10.0);
}

export function calculateGameweekRating(
  position: Position,
  stats: GameweekStats,
  opponentTier: number = 1.08
): { rating: number; breakdown: Record<string, MetricBreakdownItem> } {
  const minutes = Math.max(1, stats.minutesPlayed);
  const p90 = 90.0 / minutes;

  const goalsP90 = stats.goals * p90;
  const assistsP90 = stats.assists * p90;
  const keyPassesP90 = stats.keyPasses * p90;
  const tacklesIntP90 = (stats.tackles + stats.interceptions) * p90;
  const savesP90 = stats.saves * p90;

  const subscores: Record<string, number> = {
    goals_p90: normalizeMetric(goalsP90, BENCHMARKS.goals_p90),
    assists_p90: normalizeMetric(assistsP90, BENCHMARKS.assists_p90),
    key_passes_p90: normalizeMetric(keyPassesP90, BENCHMARKS.key_passes_p90),
    pass_accuracy: normalizePassAcc(stats.passAccuracyPct),
    interceptions_tackles_p90: normalizeMetric(tacklesIntP90, BENCHMARKS.interceptions_tackles_p90),
    clean_sheet: stats.cleanSheet ? 10.0 : 0.0,
    saves_p90: normalizeMetric(savesP90, BENCHMARKS.saves_p90),
    errors_lead_to_goal: stats.errorsLeadToGoal * 10.0,
  };

  const weights = WEIGHT_MATRIX[position] || WEIGHT_MATRIX.MID;
  const breakdown: Record<string, MetricBreakdownItem> = {};
  let rawWeighted = 0;

  for (const [metricKey, weight] of Object.entries(weights)) {
    const sub = subscores[metricKey] ?? 0;
    const contribution = sub * weight;
    breakdown[metricKey] = {
      subscore: Number(sub.toFixed(2)),
      weight,
      contribution: Number(contribution.toFixed(3)),
    };
    rawWeighted += contribution;
  }

  // Base match calibration
  const baseRating = 5.5 + rawWeighted * 0.45;
  const adjusted = baseRating * opponentTier;
  const rating = Number(Math.max(1.0, Math.min(10.0, adjusted)).toFixed(2));

  return { rating, breakdown };
}
