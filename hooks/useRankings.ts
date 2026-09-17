import { useMemo } from 'react';
import { PlayerPosition } from '@/types/player';
import { RankedPlayer } from '@/types/stats';
import { DUMMY_RANKING_PLAYERS } from '@/constants/dummyData';
import { buildRanking } from '@/lib/rankings';

/**
 * Top 10 einer Position. Phase 2 rechnet aus den Dummy-Daten, Phase 3 liest
 * die fertigen Zeilen aus `rankings_cache` (PRD 10.2) - die Signatur bleibt.
 */
export function useRankings(position: PlayerPosition): RankedPlayer[] {
  return useMemo(() => buildRanking(DUMMY_RANKING_PLAYERS[position], position), [position]);
}
