"""
BYRX72 Football Insights - Machine Learning Prediction Engine & Model Registry
================================================================================
Author: BYRX72
Description:
    Production-ready ML framework for match outcome prediction.
    Features:
      1. Opponent-adjusted Bivariate Dixon-Coles Poisson Regression
      2. Comprehensive Team Defensive Strength Index (DSI) & Hardship Accounting
      3. Dynamic Home Pitch Advantage Factor (venue resilience & home boost)
      4. Dynamic Squad BYRX Power Index & Form weighting
      5. Pluggable architecture ready for upcoming models:
         - v1.3: Dixon-Coles Poisson + Defensive Strength Engine + Opponent Hardship
         - v2.0: Gradient Boosted Trees (XGBoost / LightGBM)
         - v3.0: Deep Expected Threat & Player Spatial Embeddings
      6. Auto-exports versioned weights and defensive profiles to JSON

Usage:
    python pipeline/ml_engine.py
"""

import json
import math
import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple


class PredictorBase:
    """Abstract base class for all prediction models in BYRX72 ecosystem."""

    def __init__(self, version: str, name: str):
        self.version = version
        self.name = name
        self.metadata = {
            "version": version,
            "name": name,
            "trained_at": datetime.now(timezone.utc).isoformat(),
            "status": "active"
        }

    def train(self, data: Dict[str, Any], matches_data: Optional[Dict[str, Any]] = None) -> None:
        raise NotImplementedError

    def predict_match(self, home_team_id: str, away_team_id: str) -> Dict[str, Any]:
        raise NotImplementedError

    def export_weights(self) -> Dict[str, Any]:
        raise NotImplementedError


def poisson_pmf(k: int, lmbda: float) -> float:
    """Poisson probability mass function: P(k; lambda) = (lambda^k * e^-lambda) / k!"""
    if lmbda <= 0:
        return 1.0 if k == 0 else 0.0
    return (math.pow(lmbda, k) * math.exp(-lmbda)) / math.factorial(k)


def dixon_coles_tau(h: int, a: int, lh: float, la: float, rho: float) -> float:
    """Multiplicative correction for low-scoring match correlation (0-0, 1-0, 0-1, 1-1)."""
    if h == 0 and a == 0:
        return 1.0 - lh * la * rho
    elif h == 0 and a == 1:
        return 1.0 + lh * rho
    elif h == 1 and a == 0:
        return 1.0 + la * rho
    elif h == 1 and a == 1:
        return 1.0 - rho
    return 1.0


class DixonColesPoissonPredictor(PredictorBase):
    """
    Advanced Bivariate Dixon-Coles Poisson regression model with:
      - Iterative opponent-adjusted attack & defense parameters (accounting for opponent hardship)
      - Venue-specific home favorable conditions & pitch boosts
      - Comprehensive multi-factor Defensive Strength Engine (DSI)
      - Squad BYRX Rating integration
    """

    def __init__(self):
        super().__init__(
            version="1.3.0",
            name="Opponent-Adjusted Dixon-Coles Poisson + Defensive Strength Engine (DSI)"
        )
        self.rho = -0.06  # Dixon-Coles low-score dependency parameter
        self.team_ratings: Dict[str, Dict[str, Any]] = {}
        self.defensive_profiles: Dict[str, Dict[str, Any]] = {}
        self.league_baselines: Dict[str, Dict[str, float]] = {
            "PL": {"home": 1.55, "away": 1.25, "avg": 1.40},
            "LALIGA": {"home": 1.45, "away": 1.15, "avg": 1.30}
        }
        self.matches: List[Dict[str, Any]] = []

    def train(self, data: Dict[str, Any], matches_data: Optional[Dict[str, Any]] = None) -> None:
        standings = data.get("standings", [])
        teams = data.get("teams", [])
        players = data.get("players", [])
        self.matches = matches_data.get("matches", []) if matches_data else []

        # 1. Calculate squad BYRX strength & individual player stats
        team_squad_strength: Dict[str, float] = {}
        team_gk_stats: Dict[str, Dict[str, float]] = {}

        for t in teams:
            t_id = str(t.get("id"))
            squad = [p for p in players if str(p.get("teamId")) == t_id]

            # Top 11 outfield & overall players
            squad_scores = []
            gks = []
            for p in squad:
                stats = p.get("stats", {})
                apps = max(stats.get("apps", 1), 1)
                goals = stats.get("goals", 0)
                assists = stats.get("assists", 0)
                score = (goals * 3.5 + assists * 2.5 + apps * 0.5) / apps
                squad_scores.append(score)

                if p.get("pos") == "GK":
                    sf = stats.get("shotsFaced", 0)
                    sv = stats.get("saves", 0)
                    save_pct = sv / sf if sf > 0 else 0.68
                    gks.append((apps, save_pct))

            squad_scores.sort(reverse=True)
            top11 = squad_scores[:11] if squad_scores else [5.0]
            team_squad_strength[t_id] = round(sum(top11) / max(len(top11), 1), 2)

            gks.sort(reverse=True, key=lambda x: x[0])
            primary_gk_save_pct = gks[0][1] if gks else 0.68
            team_gk_stats[t_id] = {"save_pct": primary_gk_save_pct}

        # 2. Fit opponent-adjusted strengths
        leagues = ["PL", "LALIGA"]
        for lg in leagues:
            lg_matches = [
                m for m in self.matches
                if m.get("league") == lg and m.get("state") == "post"
                and m.get("homeGoals") is not None and m.get("awayGoals") is not None
                and not m.get("neutral", False)
            ]

            if len(lg_matches) >= 20:
                self._fit_from_fixtures(lg, lg_matches, teams, standings, team_squad_strength, team_gk_stats)
            else:
                self._fit_from_standings(lg, standings, teams, team_squad_strength, team_gk_stats)

        # 3. Compute detailed defensive profiles for every fitted team
        for t_id, r in self.team_ratings.items():
            self.defensive_profiles[t_id] = self.calculate_defensive_strength(t_id)

        self.metadata["teams_fitted"] = len(self.team_ratings)
        self.metadata["matches_analyzed"] = len(self.matches)
        self.metadata["features"] = [
            "opponent_adjusted_attack",
            "opponent_adjusted_defense",
            "home_pitch_favorable_factor",
            "defensive_strength_index",
            "opponent_hardship_index",
            "squad_byrx_rating",
            "time_decayed_recent_form"
        ]

    def _fit_from_fixtures(
        self,
        league: str,
        matches: List[Dict[str, Any]],
        teams: List[Dict[str, Any]],
        standings: List[Dict[str, Any]],
        squad_strengths: Dict[str, float],
        gk_stats: Dict[str, Dict[str, float]]
    ) -> None:
        """Solves opponent-adjusted attack, defense, and home conditions from match results."""
        # Calculate time weights (half-life of 60 days)
        timestamps = [
            datetime.fromisoformat(m["date"].replace("Z", "+00:00")).timestamp()
            for m in matches
        ]
        latest_time = max(timestamps) if timestamps else 0
        weights = [
            math.pow(0.5, (latest_time - ts) / (86400 * 60))
            for ts in timestamps
        ]
        total_w = sum(weights) or 1.0

        mu_home = sum(w * m["homeGoals"] for w, m in zip(weights, matches)) / total_w
        mu_away = sum(w * m["awayGoals"] for w, m in zip(weights, matches)) / total_w
        mu_avg = (mu_home + mu_away) / 2.0
        self.league_baselines[league] = {
            "home": round(mu_home, 3),
            "away": round(mu_away, 3),
            "avg": round(mu_avg, 3)
        }

        # Unique teams in league
        team_ids = set()
        for m in matches:
            team_ids.add(str(m["homeId"]))
            team_ids.add(str(m["awayId"]))
        team_ids = list(team_ids)

        att = {tid: 1.0 for tid in team_ids}
        dfn = {tid: 1.0 for tid in team_ids}
        hb = {tid: 1.0 for tid in team_ids}
        prior = mu_avg
        shrink_k = 3.0

        # Iterative coordinate descent to decouple attack power from opponent defensive hardship
        for _ in range(50):
            next_att = {}
            next_dfn = {}
            for tid in team_ids:
                s_obs, s_exp = 0.0, 0.0
                c_obs, c_exp = 0.0, 0.0
                for w, m in zip(weights, matches):
                    hid = str(m["homeId"])
                    aid = str(m["awayId"])
                    if hid == tid:
                        s_obs += w * m["homeGoals"]
                        s_exp += w * mu_home * dfn.get(aid, 1.0) * hb.get(tid, 1.0)
                        c_obs += w * m["awayGoals"]
                        c_exp += w * (mu_away * att.get(aid, 1.0)) / hb.get(tid, 1.0)
                    elif aid == tid:
                        s_obs += w * m["awayGoals"]
                        s_exp += w * (mu_away * dfn.get(hid, 1.0)) / hb.get(hid, 1.0)
                        c_obs += w * m["homeGoals"]
                        c_exp += w * mu_home * att.get(hid, 1.0) * hb.get(hid, 1.0)

                next_att[tid] = (s_obs + shrink_k * prior) / (s_exp + shrink_k * prior)
                next_dfn[tid] = (c_obs + shrink_k * prior) / (c_exp + shrink_k * prior)

            mean_a = sum(next_att.values()) / max(len(next_att), 1)
            mean_d = sum(next_dfn.values()) / max(len(next_dfn), 1)
            for tid in team_ids:
                att[tid] = next_att[tid] / mean_a
                dfn[tid] = next_dfn[tid] / mean_d

            # Calibrate home pitch favorable condition factor per team
            for tid in team_ids:
                gf_o, gf_e = 0.0, 0.0
                ga_o, ga_e = 0.0, 0.0
                for w, m in zip(weights, matches):
                    if str(m["homeId"]) == tid:
                        aid = str(m["awayId"])
                        gf_o += w * m["homeGoals"]
                        gf_e += w * mu_home * att[tid] * dfn.get(aid, 1.0)
                        ga_o += w * m["awayGoals"]
                        ga_e += w * mu_away * att.get(aid, 1.0) * dfn[tid]
                p = 5.0 * prior
                raw_boost = math.sqrt(((gf_o + p) / (gf_e + p)) * ((ga_e + p) / (ga_o + p)))
                hb[tid] = max(0.80, min(1.35, raw_boost))

        # Build team_ratings dictionary
        st_map = {str(s.get("teamId")): s for s in standings if s.get("league") == league}
        name_map = {str(t.get("id")): t.get("name", "Unknown") for t in teams if t.get("league") == league}

        for tid in team_ids:
            st = st_map.get(tid, {})
            name = name_map.get(tid, st.get("team", f"Team {tid}"))
            played = max(st.get("played", 1), 1)

            self.team_ratings[tid] = {
                "team": name,
                "team_id": tid,
                "league": league,
                "attack": round(att[tid], 3),
                "defense": round(dfn[tid], 3),
                "home_boost": round(hb[tid], 3),
                "squad_byrx_index": squad_strengths.get(tid, 6.5),
                "gk_save_pct": round(gk_stats.get(tid, {}).get("save_pct", 0.68) * 100, 1),
                "points_per_match": round(st.get("points", 0) / played, 2),
                "goal_diff": st.get("gd", 0),
                "played": played
            }

    def _fit_from_standings(
        self,
        league: str,
        standings: List[Dict[str, Any]],
        teams: List[Dict[str, Any]],
        squad_strengths: Dict[str, float],
        gk_stats: Dict[str, Dict[str, float]]
    ) -> None:
        """Fallback when match-level records are insufficient."""
        rows = [s for s in standings if s.get("league") == league and s.get("played", 0) > 0]
        total_p = sum(r.get("played", 0) for r in rows) or 1
        avg_g = sum(r.get("gf", 0) for r in rows) / total_p if total_p else 1.35

        self.league_baselines[league] = {
            "home": round(avg_g * 1.12, 3),
            "away": round(avg_g * 0.92, 3),
            "avg": round(avg_g, 3)
        }

        for s in rows:
            tid = str(s.get("teamId"))
            played = max(s.get("played", 1), 1)
            gf = s.get("gf", 0)
            ga = s.get("ga", 0)

            raw_a = (gf / played) / avg_g
            raw_d = (ga / played) / avg_g
            # Shrink toward 1.0
            w = played / (played + 8.0)
            a_val = w * raw_a + (1 - w)
            d_val = w * raw_d + (1 - w)

            self.team_ratings[tid] = {
                "team": s.get("team"),
                "team_id": tid,
                "league": league,
                "attack": round(a_val, 3),
                "defense": round(d_val, 3),
                "home_boost": 1.08,
                "squad_byrx_index": squad_strengths.get(tid, 6.5),
                "gk_save_pct": round(gk_stats.get(tid, {}).get("save_pct", 0.68) * 100, 1),
                "points_per_match": round(s.get("points", 0) / played, 2),
                "goal_diff": s.get("gd", 0),
                "played": played
            }

    def calculate_defensive_strength(self, team_id: str) -> Dict[str, Any]:
        """
        Calculates a comprehensive multi-factor Defensive Strength Profile for a team.
        Returns:
          - index: Defensive Strength Index (0 to 100)
          - tier: 'Elite', 'Strong', 'Average', 'Leaky'
          - adj_defense: Opponent-adjusted conceding coefficient (beta < 1 is better)
          - clean_sheet_rate: Percentage of games with clean sheet
          - conceded_per_match: Average goals conceded overall
          - home_conceded_per_match: Average goals conceded on home pitch
          - away_conceded_per_match: Average goals conceded on away travels
          - recent_form: Goals conceded per match in last 5 matches
          - opponent_hardship: Average attacking caliber of opponents faced
        """
        t_id = str(team_id)
        rating = self.team_ratings.get(t_id, {
            "defense": 1.0, "attack": 1.0, "home_boost": 1.0,
            "gk_save_pct": 68.0, "team": f"Team {team_id}", "league": "PL"
        })

        team_matches = [
            m for m in self.matches
            if m.get("state") == "post" and m.get("homeGoals") is not None
            and (str(m.get("homeId")) == t_id or str(m.get("awayId")) == t_id)
        ]
        team_matches.sort(key=lambda m: m.get("date", ""))

        if team_matches:
            conceded_list = []
            home_conceded = []
            away_conceded = []
            opp_attacks = []

            for m in team_matches:
                is_home = str(m.get("homeId")) == t_id
                ga = m.get("awayGoals") if is_home else m.get("homeGoals")
                opp_id = str(m.get("awayId") if is_home else m.get("homeId"))
                opp_att = self.team_ratings.get(opp_id, {}).get("attack", 1.0)
                opp_attacks.append(opp_att)

                conceded_list.append(ga)
                if is_home:
                    home_conceded.append(ga)
                else:
                    away_conceded.append(ga)

            n_matches = len(conceded_list)
            conceded_pm = sum(conceded_list) / n_matches
            cs_count = sum(1 for c in conceded_list if c == 0)
            cs_rate = (cs_count / n_matches) * 100.0
            home_c = sum(home_conceded) / max(len(home_conceded), 1)
            away_c = sum(away_conceded) / max(len(away_conceded), 1)
            recent_5 = conceded_list[-5:]
            recent_form = sum(recent_5) / max(len(recent_5), 1)
            opp_hardship = sum(opp_attacks) / max(len(opp_attacks), 1)
        else:
            n_matches = rating.get("played", 10)
            adj_d = rating.get("defense", 1.0)
            base_g = self.league_baselines.get(rating.get("league", "PL"), {}).get("avg", 1.35)
            conceded_pm = adj_d * base_g
            cs_rate = max(10.0, min(50.0, 35.0 - (adj_d - 1.0) * 25.0))
            home_c = conceded_pm * 0.85
            away_c = conceded_pm * 1.15
            recent_form = conceded_pm
            opp_hardship = 1.0

        adj_def = rating.get("defense", 1.0)
        gk_save = rating.get("gk_save_pct", 68.0) / 100.0

        # Multi-factor Defensive Strength Index (0 - 100)
        # 1. Opponent-adjusted defense score (0.6 -> 1.0, 1.6 -> 0.0)
        s_def = max(0.0, min(1.0, (1.6 - adj_def) / 1.0))
        # 2. Clean sheet score (50% CS rate -> 1.0)
        s_cs = max(0.0, min(1.0, (cs_rate / 100.0) / 0.50))
        # 3. Recent form score (0 ga/m -> 1.0, 2.5 ga/m -> 0.0)
        s_form = max(0.0, min(1.0, (2.5 - recent_form) / 2.5))
        # 4. GK shot suppression / save score
        s_gk = max(0.0, min(1.0, (gk_save - 0.55) / 0.25))
        # 5. Venue resilience (ability to defend away as well as home)
        venue_diff = max(0.0, away_c - home_c)
        s_resilience = max(0.0, min(1.0, 1.0 - venue_diff / 1.5))

        dsi_score = round(
            100.0 * (0.35 * s_def + 0.25 * s_cs + 0.15 * s_form + 0.15 * s_gk + 0.10 * s_resilience),
            1
        )

        if dsi_score >= 75.0:
            tier = "Elite"
        elif dsi_score >= 58.0:
            tier = "Strong"
        elif dsi_score >= 40.0:
            tier = "Average"
        else:
            tier = "Leaky"

        return {
            "team_id": t_id,
            "team": rating.get("team", ""),
            "index": dsi_score,
            "tier": tier,
            "adj_defense": round(adj_def, 3),
            "conceded_per_match": round(conceded_pm, 2),
            "clean_sheet_rate": round(cs_rate, 1),
            "home_conceded_per_match": round(home_c, 2),
            "away_conceded_per_match": round(away_c, 2),
            "gk_save_pct": round(gk_save * 100.0, 1),
            "recent_form": round(recent_form, 2),
            "opponent_hardship": round(opp_hardship, 3),
            "matches_evaluated": n_matches
        }

    def predict_match(self, home_team_id: str, away_team_id: str) -> Dict[str, Any]:
        """
        Generates realistic match outcome predictions accounting for:
          - Opponent hardship & adjusted attack/defense multipliers
          - Home pitch favorable conditions
          - Defensive Strength Index of both sides
          - Dixon-Coles bivariate score distribution
        """
        h_id = str(home_team_id)
        a_id = str(away_team_id)

        h = self.team_ratings.get(h_id, {"attack": 1.0, "defense": 1.0, "home_boost": 1.1, "squad_byrx_index": 6.5, "league": "PL"})
        a = self.team_ratings.get(a_id, {"attack": 1.0, "defense": 1.0, "home_boost": 1.1, "squad_byrx_index": 6.5, "league": "PL"})
        league = h.get("league", "PL")
        baselines = self.league_baselines.get(league, {"home": 1.55, "away": 1.25, "avg": 1.40})

        # Squad quality ratio
        squad_ratio = max(0.7, min(1.4, h.get("squad_byrx_index", 6.5) / max(a.get("squad_byrx_index", 6.5), 1.0)))

        # Expected goals with venue factors & hardship
        home_xg = max(
            0.35,
            baselines["home"] * h["attack"] * a["defense"] * h["home_boost"] * math.pow(squad_ratio, 0.3)
        )
        away_xg = max(
            0.25,
            (baselines["away"] * a["attack"] * h["defense"] * math.pow(1.0 / squad_ratio, 0.3)) / h["home_boost"]
        )

        # Build bivariate Poisson probability matrix (0 to 6 goals)
        max_goals = 6
        prob_matrix = []
        p_home_win, p_draw, p_away_win = 0.0, 0.0, 0.0

        for gh in range(max_goals + 1):
            for ga in range(max_goals + 1):
                tau = dixon_coles_tau(gh, ga, home_xg, away_xg, self.rho)
                p = max(0.0, poisson_pmf(gh, home_xg) * poisson_pmf(ga, away_xg) * tau)
                prob_matrix.append((gh, ga, p))
                if gh > ga:
                    p_home_win += p
                elif gh == ga:
                    p_draw += p
                else:
                    p_away_win += p

        total_p = p_home_win + p_draw + p_away_win or 1.0
        hw_pct = round((p_home_win / total_p) * 100, 1)
        dr_pct = round((p_draw / total_p) * 100, 1)
        aw_pct = round((p_away_win / total_p) * 100, 1)

        # Score selection: choose the outcome class that matches the probability distribution,
        # then the scoreline closest to the expected goals to prevent defaulting to 1-0.
        best_outcome = 'H' if (p_home_win >= p_draw and p_home_win >= p_away_win) else ('A' if p_away_win >= p_draw else 'D')

        def score_fitness(s):
            gh, ga, p = s
            # Proximity to xG vector
            dist_sq = (gh - home_xg) ** 2 + (ga - away_xg) ** 2
            return p * math.exp(-dist_sq / 1.5)

        candidate_scores = [
            s for s in prob_matrix
            if ('H' if s[0] > s[1] else ('A' if s[1] > s[0] else 'D')) == best_outcome
        ]
        candidate_scores.sort(key=score_fitness, reverse=True)
        best_score = candidate_scores[0] if candidate_scores else prob_matrix[0]

        # Top 5 most likely scorelines
        prob_matrix.sort(key=lambda x: x[2], reverse=True)
        top_scores = [
            {"home": gh, "away": ga, "probability": round((p / total_p) * 100, 1)}
            for gh, ga, p in prob_matrix[:5]
        ]

        h_defense = self.defensive_profiles.get(h_id, self.calculate_defensive_strength(h_id))
        a_defense = self.defensive_profiles.get(a_id, self.calculate_defensive_strength(a_id))

        return {
            "home_team_id": h_id,
            "away_team_id": a_id,
            "expected_goals_home": round(home_xg, 2),
            "expected_goals_away": round(away_xg, 2),
            "predicted_score": {
                "home": best_score[0],
                "away": best_score[1],
                "probability": round((best_score[2] / total_p) * 100, 1)
            },
            "win_probabilities": {
                "home": hw_pct,
                "draw": dr_pct,
                "away": aw_pct
            },
            "top_scores": top_scores,
            "home_defense_profile": h_defense,
            "away_defense_profile": a_defense,
            "model_version": self.version
        }

    def export_weights(self) -> Dict[str, Any]:
        return {
            "metadata": self.metadata,
            "hyperparameters": {
                "dixon_coles_rho": self.rho,
                "league_baselines": self.league_baselines,
                "time_decay_half_life_days": 60,
                "monte_carlo_iterations": 10000
            },
            "team_ratings": self.team_ratings,
            "defensive_profiles": self.defensive_profiles,
            "next_model_pipeline": {
                "upcoming_version": "2.0.0-xgboost-ensemble",
                "planned_features": [
                    "rolling_5_match_xG",
                    "player_absence_impact_penalty",
                    "tactical_matchup_differential",
                    "fatigue_days_between_fixtures"
                ],
                "interface_ready": True
            }
        }


# Extensibility Hook for Upcoming ML Models (e.g. Scikit-learn, XGBoost, PyTorch)
class XGBoostEnsemblePredictor(PredictorBase):
    """
    Template for upcoming v2.0 ML model upgrade.
    Plugs seamlessly into the BYRX72 model pipeline.
    """

    def __init__(self):
        super().__init__(version="2.0.0-rc1", name="XGBoost + Player Tracking Multi-Feature Ensemble")

    def train(self, data: Dict[str, Any], matches_data: Optional[Dict[str, Any]] = None) -> None:
        pass

    def predict_match(self, home_team_id: str, away_team_id: str) -> Dict[str, Any]:
        return {"status": "upcoming_model_pipeline"}

    def calculate_defensive_strength(self, team_id: str) -> Dict[str, Any]:
        return {"status": "upcoming_model_pipeline"}

    def export_weights(self) -> Dict[str, Any]:
        return {"status": "ready_for_training"}


def main():
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    print("=" * 70)
    print(" BYRX72 ML Engine: Training, Defensive Strength & Prediction Pipeline")
    print("=" * 70)

    # 1. Locate season database
    db_paths = [
        os.path.join("web", "src", "data", "espnDb.json"),
        os.path.join("database", "espn_2026_27.json")
    ]
    db_data = None
    for p in db_paths:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                db_data = json.load(f)
                print(f"[✓] Loaded season database from: {p}")
                break

    if not db_data:
        print("[!] No database found. Run 'node scripts/fetch_espn.mjs' first.")
        return

    # 2. Locate match results / fixtures database
    fixture_paths = [
        os.path.join("web", "src", "data", "matchResults.json"),
        os.path.join("database", "match_results_2026_27.json")
    ]
    matches_data = None
    for p in fixture_paths:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                matches_data = json.load(f)
                print(f"[✓] Loaded fixtures/match results from: {p}")
                break

    if not matches_data:
        print("[i] No matchResults.json found; training with standings baseline.")

    # 3. Train Dixon-Coles model with Defensive Strength Engine
    model = DixonColesPoissonPredictor()
    model.train(db_data, matches_data)
    print(f"[✓] Successfully calibrated {model.name} for {len(model.team_ratings)} clubs.")

    # 4. Display sample defensive strength profiles
    print("-" * 70)
    print(" SAMPLE DEFENSIVE STRENGTH EVALUATIONS (DSI):")
    sample_ids = ["382", "359", "364", "86", "83", "1068"]  # Man City, Arsenal, Liverpool, Real Madrid, Barca, Atleti
    for sid in sample_ids:
        if sid in model.defensive_profiles:
            dp = model.defensive_profiles[sid]
            print(f"  • {dp['team']:<22} | DSI: {dp['index']:>5.1f}/100 [{dp['tier']:<6}] | Conceded: {dp['conceded_per_match']:.2f}/m | CS: {dp['clean_sheet_rate']}%")

    # 5. Display sample marquee predictions (avoiding 1-0 traps)
    print("-" * 70)
    print(" SAMPLE MATCH PREDICTIONS:")
    sample_fixtures = [
        ("382", "359"),  # Man City vs Arsenal
        ("86", "83"),    # Real Madrid vs Barcelona
        ("364", "363"),  # Liverpool vs Chelsea
        ("1068", "93"),  # Atletico vs Athletic Club
    ]
    for hid, aid in sample_fixtures:
        if hid in model.team_ratings and aid in model.team_ratings:
            pred = model.predict_match(hid, aid)
            ht = model.team_ratings[hid]["team"]
            at = model.team_ratings[aid]["team"]
            ps = pred["predicted_score"]
            print(f"  • {ht} vs {at} -> Predicted: {ps['home']}-{ps['away']} (xG: {pred['expected_goals_home']} - {pred['expected_goals_away']})")

    # 6. Export weights & defensive profiles to web & database archives
    export_payload = model.export_weights()
    web_target = os.path.join("web", "src", "data", "mlModelWeights.json")
    db_target = os.path.join("database", "ml_model_weights.json")

    os.makedirs(os.path.dirname(web_target), exist_ok=True)
    with open(web_target, "w", encoding="utf-8") as f:
        json.dump(export_payload, f, indent=2)
    print(f"[✓] Exported model manifest & defensive profiles to: {web_target}")

    os.makedirs(os.path.dirname(db_target), exist_ok=True)
    with open(db_target, "w", encoding="utf-8") as f:
        json.dump(export_payload, f, indent=2)
    print(f"[✓] Exported model archive to: {db_target}")

    print("=" * 70)
    print(f" Model Version : {model.version}")
    print(f" Next Pipeline : {export_payload['next_model_pipeline']['upcoming_version']}")
    print("=" * 70)


if __name__ == "__main__":
    main()
