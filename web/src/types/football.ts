export type LeagueId = 'PL' | 'LALIGA';

export type Position = 'FWD' | 'MID' | 'DEF' | 'GK';

export interface MetricBreakdownItem {
  subscore: number;       // 0 to 10
  weight: number;         // e.g. 0.30
  contribution: number;   // subscore * weight
}

export interface GameweekStats {
  goals: number;
  assists: number;
  keyPasses: number;
  passAccuracyPct: number;
  tackles: number;
  interceptions: number;
  cleanSheet: boolean;
  saves: number;
  errorsLeadToGoal: number;
  minutesPlayed: number;
}

export interface GameweekRecord {
  gameweek: number;
  opponent: string;
  opponentTier: number;   // 1.00 to 1.25 multiplier
  isHome: boolean;
  scoreResult: string;
  stats: GameweekStats;
  rating: number;         // 1.00 to 10.00
  breakdown: Record<string, MetricBreakdownItem>;
}

export interface RadarAttributes {
  attacking: number;       // 0 - 100
  creation: number;        // 0 - 100
  retention: number;       // 0 - 100
  defending: number;       // 0 - 100
  physicality: number;     // 0 - 100
  matchImpact: number;     // 0 - 100
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  team: string;
  teamShort: string;
  teamCrest?: string;
  stadium?: string;
  league: LeagueId;
  position: Position;
  nationality: string;
  flag: string;
  avatar: string;
  number: number;
  age: number;
  marketValue: string;
  seasonScore: number;
  seasonStats: {
    matches: number;
    minutes: number;
    goals: number;
    assists: number;
    keyPasses: number;
    passAccuracyPct: number;
    tackles: number;
    interceptions: number;
    cleanSheets: number;
    saves: number;
    errorsLeadToGoal: number;
  };
  gameweeks: Record<number, GameweekRecord>;
  radar: RadarAttributes;
}
