import { PlayerPosition, PlayerWithStats } from '@/types/player';
import { RankedPlayer, ScoreRow } from '@/types/stats';
import { SCORE_FACTORS, SCORE_ROW_LABELS } from '@/constants/positions';

/**
 * Erfolgreiche Dribblings - Sportmonks liefert Versuche plus Erfolgsquote,
 * die Score-Tabelle zeigt die erfolgreichen.
 */
function successfulDribbles(player: PlayerWithStats) {
  return Math.round((player.stats.dribbles * player.stats.dribbleSuccessRate) / 100);
}

/** Die vier Zeilen der Score-Tabelle fuer einen Spieler (PRD 7.4). */
export function scoreRows(player: PlayerWithStats, position: PlayerPosition): ScoreRow[] {
  const factors = SCORE_FACTORS[position];
  const counts = {
    goals: player.stats.goals,
    assists: player.stats.assists,
    chancesCreated: player.stats.chancesCreated,
    dribbles: successfulDribbles(player),
  };

  return (Object.keys(counts) as (keyof typeof counts)[]).map((key) => ({
    label: SCORE_ROW_LABELS[key],
    count: counts[key],
    factor: factors[key],
    score: counts[key] * factors[key],
  }));
}

/**
 * Baut die sortierte Rangliste einer Position. In Phase 3 kommt das Ergebnis
 * vorberechnet aus `rankings_cache` - die Rechnung bleibt dieselbe.
 */
export function buildRanking(
  players: PlayerWithStats[],
  position: PlayerPosition,
  limit = 10
): RankedPlayer[] {
  return players
    .map((player) => {
      const rows = scoreRows(player, position);
      return {
        player,
        rows,
        score: rows.reduce((sum, row) => sum + row.score, 0),
        rank: 0,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/** Zahl in deutscher Schreibweise, ohne unnoetige Nachkommastellen (152, 17,5). */
export function formatScore(value: number) {
  return value.toLocaleString('de-DE', { maximumFractionDigits: 2 });
}

/** Faktor-Spalte der Tabelle: x2, x0,5, x0,25. */
export function formatFactor(value: number) {
  return `x${formatScore(value)}`;
}
