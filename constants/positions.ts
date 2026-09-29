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

/**
 * Platzhalter-Modell der ersten Fassung: vier Kategorien, nur die Faktoren
 * unterscheiden sich. Wird Position fuer Position durch ein hergeleitetes
 * Modell ersetzt (siehe docs/score-modell.md).
 */
function placeholderModel(
  goals: number,
  assists: number,
  chancesCreated: number,
  dribbles: number
): ScoreCategory[] {
  return [
    { key: 'goals', factor: goals },
    { key: 'assists', factor: assists },
    { key: 'chancesCreated', factor: chancesCreated },
    { key: 'successfulDribbles', factor: dribbles },
  ];
}

/**
 * Stats, aus denen sich ein Score zusammensetzen kann. Die Werte dazu liefert
 * `STAT_VALUE` in `lib/rankings.ts`.
 */
export type ScoreStatKey =
  | 'goals'
  | 'assists'
  | 'bigChancesCreated'
  | 'shotsOnTarget'
  | 'touchesInBox'
  | 'successfulCrosses'
  | 'successfulDribbles'
  | 'chancesCreated';

/** Beschriftung der Zeile in der Score-Tabelle. */
export const SCORE_STAT_LABELS: Record<ScoreStatKey, string> = {
  goals: 'Tore',
  assists: 'Torvorlagen',
  bigChancesCreated: 'Großchancen kreiert',
  shotsOnTarget: 'Schüsse aufs Tor',
  touchesInBox: 'Kontakte im Strafraum',
  successfulCrosses: 'Erfolgr. Flanken',
  successfulDribbles: 'Erfolgr. Dribblings',
  chancesCreated: 'Kreierte Chancen',
};

export interface ScoreCategory {
  key: ScoreStatKey;
  factor: number;
}

/**
 * Score-Modell pro Position: welche Kategorien zaehlen und mit welchem Faktor.
 * Ein Tor ist 10 Punkte, alles andere misst sich daran.
 *
 * **Jeder Faktor ist begruendet — die Herleitung steht in
 * `docs/score-modell.md` und gehoert zu PRD §7.4. Faktoren hier nicht ohne
 * Begruendung dort aendern.**
 *
 * Kurzfassung: Tore und Torvorlagen tragen den Score (Torwert 1,0 und 0,7).
 * Die uebrigen drei Kategorien messen Gefahr statt Ertrag; sie zaehlen
 * Aktionen mit, die schon in den Toren stecken, und sind deshalb bewusst
 * klein gehalten - ein Schuss aufs Tor, der nicht reingeht, ist 1/50 Tor wert.
 *
 * ST und Fluegel sind abgestimmt. Die uebrigen Positionen sind Platzhalter aus
 * der ersten Fassung und noch nicht hergeleitet.
 */
export const SCORE_MODEL: Record<PlayerPosition, ScoreCategory[]> = {
  ST: [
    { key: 'goals', factor: 10 },
    { key: 'assists', factor: 7 },
    { key: 'bigChancesCreated', factor: 0.3 },
    { key: 'shotsOnTarget', factor: 0.2 },
    { key: 'touchesInBox', factor: 0.05 },
  ],
  LF: [
    { key: 'goals', factor: 10 },
    { key: 'assists', factor: 7 },
    { key: 'bigChancesCreated', factor: 0.3 },
    { key: 'successfulCrosses', factor: 0.3 },
    { key: 'successfulDribbles', factor: 0.05 },
  ],
  RF: [
    { key: 'goals', factor: 10 },
    { key: 'assists', factor: 7 },
    { key: 'bigChancesCreated', factor: 0.3 },
    { key: 'successfulCrosses', factor: 0.3 },
    { key: 'successfulDribbles', factor: 0.05 },
  ],
  // --- ab hier Platzhalter, noch nicht hergeleitet ---
  OM: placeholderModel(1.5, 2, 1, 0.5),
  ZM: placeholderModel(1.25, 1.75, 1, 0.5),
  DM: placeholderModel(1, 1.5, 0.75, 0.25),
  IV: placeholderModel(1, 1, 0.5, 0.25),
  LV: placeholderModel(1.25, 1.75, 0.75, 0.5),
  RV: placeholderModel(1.25, 1.75, 0.75, 0.5),
  // Fuer den Torwart passt keine dieser Kategorien - er braucht eigene
  // (Paraden, Gegentore, Weisse Westen), siehe docs/score-modell.md.
  TW: placeholderModel(1, 1, 0.5, 0.25),
};
