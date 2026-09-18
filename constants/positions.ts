import { PlayerPosition } from '../types/player';

/** Reihenfolge im Positions-Filter (PRD 5.6, erweitert um ZM und TW). */
export const POSITIONS: PlayerPosition[] = [
  'ST',
  'LF',
  'RF',
  'OM',
  'ZM',
  'DM',
  'IV',
  'LV',
  'RV',
  'TW',
];

export const POSITION_LABELS: Record<PlayerPosition, string> = {
  ST: 'ST',
  LF: 'LF',
  RF: 'RF',
  OM: 'OM',
  ZM: 'ZM',
  DM: 'DM',
  IV: 'IV',
  LV: 'LV',
  RV: 'RV',
  TW: 'TW',
};

/** Mannschaftsteil einer Position - bestimmt die Farbe der Top-3-Karten. */
export type PositionGroup = 'attack' | 'midfield' | 'defense' | 'goalkeeper';

export const POSITION_GROUP: Record<PlayerPosition, PositionGroup> = {
  ST: 'attack',
  LF: 'attack',
  RF: 'attack',
  OM: 'midfield',
  ZM: 'midfield',
  DM: 'midfield',
  IV: 'defense',
  LV: 'defense',
  RV: 'defense',
  TW: 'goalkeeper',
};

/** Die vier Kategorien, aus denen sich der Rankings-Score zusammensetzt (PRD 7.4). */
export interface ScoreFactors {
  goals: number;
  assists: number;
  chancesCreated: number;
  dribbles: number;
}

/**
 * Gewichtung pro Position. Nur ST ist in der PRD (7.4) festgelegt:
 * Score = Tore x2 + Vorlagen x1 + Kreierte Chancen x0,5 + Erfolgr. Dribblings x0,25.
 * Die uebrigen Positionen sind bis zur fachlichen Festlegung Platzhalter. Fuer
 * TW passen diese vier Kategorien fachlich nicht - ein Torhueter braucht eigene
 * (Paraden, Gegentore, Weisse Westen), sobald die Kategorien je Position
 * variabel sind.
 */
export const SCORE_FACTORS: Record<PlayerPosition, ScoreFactors> = {
  ST: { goals: 2, assists: 1, chancesCreated: 0.5, dribbles: 0.25 },
  LF: { goals: 1.5, assists: 1.5, chancesCreated: 0.75, dribbles: 0.5 },
  RF: { goals: 1.5, assists: 1.5, chancesCreated: 0.75, dribbles: 0.5 },
  OM: { goals: 1.5, assists: 2, chancesCreated: 1, dribbles: 0.5 },
  ZM: { goals: 1.25, assists: 1.75, chancesCreated: 1, dribbles: 0.5 },
  DM: { goals: 1, assists: 1.5, chancesCreated: 0.75, dribbles: 0.25 },
  IV: { goals: 1, assists: 1, chancesCreated: 0.5, dribbles: 0.25 },
  LV: { goals: 1.25, assists: 1.75, chancesCreated: 0.75, dribbles: 0.5 },
  RV: { goals: 1.25, assists: 1.75, chancesCreated: 0.75, dribbles: 0.5 },
  TW: { goals: 1, assists: 1, chancesCreated: 0.5, dribbles: 0.25 },
};

/** Zeilenbeschriftung der Score-Tabelle, Reihenfolge wie im Figma (Node 256:138). */
export const SCORE_ROW_LABELS: Record<keyof ScoreFactors, string> = {
  goals: 'Tore',
  assists: 'Vorlagen',
  chancesCreated: 'Kreierte Chancen',
  dribbles: 'Erfolgr. Dribblings',
};
