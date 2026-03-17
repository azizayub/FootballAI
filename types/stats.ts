import { PlayerPosition } from './player';

export interface RankingEntry {
  rank: number;
  playerId: number;
  score: number;
  scoreBreakdown: {
    goals: number;
    goalsScore: number;
    assists: number;
    assistsScore: number;
    chancesCreated: number;
    chancesCreatedScore: number;
    dribbles: number;
    dribblesScore: number;
    total: number;
  };
}

export interface RankingFilter {
  position: PlayerPosition;
}

export interface Competition {
  id: number;
  name: string;
  logo: string;
  season: string;
}
