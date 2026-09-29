import { PlayerPosition, PlayerWithStats } from '@/types/player';
import { RankedPlayer, ScoreRow } from '@/types/stats';
import { SCORE_MODEL, SCORE_STAT_LABELS, ScoreStatKey } from '@/constants/positions';

/**
 * Woher der Wert einer Score-Kategorie kommt. Manche Stats liefert Sportmonks
 * als Versuche plus Erfolgsquote - die Tabelle zeigt die erfolgreichen.
 */
const STAT_VALUE: Record<ScoreStatKey, (player: PlayerWithStats) => number> = {
  goals: (p) => p.stats.goals,
  assists: (p) => p.stats.assists,
  bigChancesCreated: (p) => p.stats.bigChancesCreated,
  shotsOnTarget: (p) => p.stats.shotsOnTarget,
  touchesInBox: (p) => p.stats.touchesInBox,
  successfulCrosses: (p) => p.stats.successfulCrosses,
  successfulDribbles: (p) => Math.round((p.stats.dribbles * p.stats.dribbleSuccessRate) / 100),
  chancesCreated: (p) => p.stats.chancesCreated,
};

/** Die Zeilen der Score-Tabelle fuer einen Spieler (PRD 7.4). */
export function scoreRows(player: PlayerWithStats, position: PlayerPosition): ScoreRow[] {
  return SCORE_MODEL[position].map(({ key, factor }) => {
    const count = STAT_VALUE[key](player);
    return {
      label: SCORE_STAT_LABELS[key],
      count,
      factor,
      score: count * factor,
    };
  });
}

/**
 * Bei gleichem Score gewinnt, wer dafuer weniger gebraucht hat: erst weniger
 * Spiele, dann weniger Minuten. Wer dieselbe Leistung in weniger Zeit bringt,
 * war effizienter (siehe docs/score-modell.md §7).
 */
function compareEntries(a: RankedPlayer, b: RankedPlayer) {
  if (b.score !== a.score) return b.score - a.score;
  if (a.player.stats.appearances !== b.player.stats.appearances) {
    return a.player.stats.appearances - b.player.stats.appearances;
  }
  return a.player.stats.minutesPlayed - b.player.stats.minutesPlayed;
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
    .sort(compareEntries)
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/** Zahl in deutscher Schreibweise, ohne unnoetige Nachkommastellen (152, 17,5). */
export function formatScore(value: number) {
  return value.toLocaleString('de-DE', { maximumFractionDigits: 2 });
}

/** Faktor-Spalte der Tabelle: x10, x0,3, x0,05. */
export function formatFactor(value: number) {
  return `x${formatScore(value)}`;
}
