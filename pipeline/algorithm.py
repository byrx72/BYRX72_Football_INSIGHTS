"""
BYRX72 Football Insights - Scoring Engine Algorithm
Author: BYRX72
Description:
    Position-Adjusted, Per-90 Normalized Performance Scoring Model
    incorporating Opponent Difficulty Multipliers for Premier League & La Liga.
"""

from typing import Dict, Any, List
import json

# Position Weights Matrix as defined in the algorithmic specification
WEIGHT_MATRIX = {
    "FWD": {
        "goals_p90": 0.30,
        "assists_p90": 0.20,
        "key_passes_p90": 0.10,
        "pass_accuracy": 0.05,
        "interceptions_tackles_p90": 0.05,
        "clean_sheet": 0.00,
        "saves_p90": 0.00,
        "errors_lead_to_goal": -0.10,
    },
    "MID": {
        "goals_p90": 0.15,
        "assists_p90": 0.25,
        "key_passes_p90": 0.25,
        "pass_accuracy": 0.15,
        "interceptions_tackles_p90": 0.15,
        "clean_sheet": 0.05,
        "saves_p90": 0.00,
        "errors_lead_to_goal": -0.10,
    },
    "DEF": {
        "goals_p90": 0.05,
        "assists_p90": 0.05,
        "key_passes_p90": 0.05,
        "pass_accuracy": 0.10,
        "interceptions_tackles_p90": 0.35,
        "clean_sheet": 0.20,
        "saves_p90": 0.00,
        "errors_lead_to_goal": -0.15,
    },
    "GK": {
        "goals_p90": 0.00,
        "assists_p90": 0.00,
        "key_passes_p90": 0.00,
        "pass_accuracy": 0.05,
        "interceptions_tackles_p90": 0.00,
        "clean_sheet": 0.30,
        "saves_p90": 0.40,
        "errors_lead_to_goal": -0.15,
    }
}

# Elite Tier Reference Benchmarks for 0-10 normalization (Per-90 values)
BENCHMARKS = {
    "goals_p90": 1.10,                 # 1.1+ goals/90 = 10.0 score
    "assists_p90": 0.70,               # 0.7+ assists/90 = 10.0 score
    "key_passes_p90": 3.80,            # 3.8+ key passes/90 = 10.0 score
    "pass_accuracy": 100.0,            # 100% pass completion = 10.0 score (rescaled baseline 65% = 0)
    "interceptions_tackles_p90": 5.50, # 5.5+ tackles/interceptions/90 = 10.0 score
    "saves_p90": 6.00,                 # 6+ saves/90 = 10.0 score
}

# Opponent Difficulty Multiplier (1.00x to 1.25x) based on league strength
OPPONENT_STRENGTH_TIERS = {
    "Tier 1 (Title Contenders: Man City, Arsenal, Real Madrid, Barcelona)": 1.25,
    "Tier 2 (European Contenders: Liverpool, Atletico Madrid, Aston Villa, Athletic Club)": 1.15,
    "Tier 3 (Mid-table: Chelsea, Newcastle, Real Sociedad, Villarreal, Spurs)": 1.08,
    "Tier 4 (Bottom-half & Relegation zone)": 1.00,
}


def normalize_metric(val: float, benchmark: float) -> float:
    """Normalize raw metric to a 0-10 benchmark scale with diminishing returns cap."""
    if benchmark <= 0:
        return 0.0
    ratio = val / benchmark
    # Diminishing returns scaling up to max 10.0
    return min(10.0, max(0.0, ratio * 10.0))


def normalize_pass_acc(accuracy_pct: float) -> float:
    """Normalize pass accuracy where 65% is baseline (0.0) and 95%+ is 10.0."""
    baseline = 65.0
    ceiling = 95.0
    if accuracy_pct <= baseline:
        return 0.0
    return min(10.0, ((accuracy_pct - baseline) / (ceiling - baseline)) * 10.0)


def calculate_player_gameweek_score(
    player_id: str,
    name: str,
    position: str,
    minutes_played: int,
    raw_stats: Dict[str, Any],
    opponent_tier: float = 1.08,
    clean_sheet: bool = False
) -> Dict[str, Any]:
    """
    Computes player performance score (1.00 to 10.00 scale) for a gameweek.
    """
    if minutes_played < 15:
        # Minimum threshold of 15 minutes required for a valid rating
        return {
            "player_id": player_id,
            "name": name,
            "final_score": None,
            "reason": "Insufficient minutes played (<15 min)"
        }

    # 1. Convert to Per-90 statistics
    p90_factor = 90.0 / float(minutes_played)
    goals_p90 = raw_stats.get("goals", 0) * p90_factor
    assists_p90 = raw_stats.get("assists", 0) * p90_factor
    key_passes_p90 = raw_stats.get("key_passes", 0) * p90_factor
    tackles_interceptions_p90 = (raw_stats.get("tackles", 0) + raw_stats.get("interceptions", 0)) * p90_factor
    saves_p90 = raw_stats.get("saves", 0) * p90_factor
    pass_acc = float(raw_stats.get("pass_accuracy_pct", 80.0))
    errors = raw_stats.get("errors_lead_to_goal", 0)

    # 2. Subscore Normalization (0-10 scale)
    subscores = {
        "goals_p90": normalize_metric(goals_p90, BENCHMARKS["goals_p90"]),
        "assists_p90": normalize_metric(assists_p90, BENCHMARKS["assists_p90"]),
        "key_passes_p90": normalize_metric(key_passes_p90, BENCHMARKS["key_passes_p90"]),
        "pass_accuracy": normalize_pass_acc(pass_acc),
        "interceptions_tackles_p90": normalize_metric(tackles_interceptions_p90, BENCHMARKS["interceptions_tackles_p90"]),
        "clean_sheet": 10.0 if clean_sheet else 0.0,
        "saves_p90": normalize_metric(saves_p90, BENCHMARKS["saves_p90"]),
        "errors_lead_to_goal": float(errors) * 10.0, # scaled negative penalty
    }

    # 3. Position Weighted Calculation
    weights = WEIGHT_MATRIX.get(position.upper(), WEIGHT_MATRIX["MID"])
    raw_weighted_score = 0.0
    breakdown = {}

    for metric_name, weight in weights.items():
        sub = subscores.get(metric_name, 0.0)
        contrib = sub * weight
        breakdown[metric_name] = {
            "subscore": round(sub, 2),
            "weight": weight,
            "contribution": round(contrib, 3)
        }
        raw_weighted_score += contrib

    # 4. Base floor + Opponent Multiplier calibration
    # Base match rating floor is 6.00 (average professional match baseline)
    base_rating = 5.5 + (raw_weighted_score * 0.45)
    
    # Apply opponent context multiplier
    adjusted_rating = base_rating * opponent_tier
    
    # Cap between 1.00 and 10.00
    final_score = round(max(1.0, min(10.0, adjusted_rating)), 2)

    return {
        "player_id": player_id,
        "name": name,
        "position": position,
        "minutes_played": minutes_played,
        "opponent_multiplier": opponent_tier,
        "final_score": final_score,
        "breakdown": breakdown,
        "p90_stats": {
            "goals_p90": round(goals_p90, 2),
            "assists_p90": round(assists_p90, 2),
            "key_passes_p90": round(key_passes_p90, 2),
            "tackles_interceptions_p90": round(tackles_interceptions_p90, 2),
            "saves_p90": round(saves_p90, 2),
            "pass_accuracy_pct": pass_acc
        }
    }


if __name__ == "__main__":
    # Test sample: Erling Haaland (Man City vs Liverpool - Tier 2)
    haaland_score = calculate_player_gameweek_score(
        player_id="fwd-01",
        name="Erling Haaland",
        position="FWD",
        minutes_played=90,
        raw_stats={
            "goals": 2,
            "assists": 0,
            "key_passes": 1,
            "pass_accuracy_pct": 82.0,
            "tackles": 0,
            "interceptions": 0,
            "errors_lead_to_goal": 0
        },
        opponent_tier=1.15,
        clean_sheet=False
    )
    print("Haaland Rating:", json.dumps(haaland_score, indent=2))
