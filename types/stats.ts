import { PlayerPosition, PlayerWithStats } from './player';

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

/** Eine Zeile der aufgeklappten Score-Tabelle (Figma Node 256:138). */
export interface ScoreRow {
  label: string;
  count: number;
  factor: number;
  score: number;
}

/** Ein Eintrag der Rankings-Liste inklusive offengelegter Rechnung. */
export interface RankedPlayer {
  rank: number;
  player: PlayerWithStats;
  score: number;
  rows: ScoreRow[];
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
