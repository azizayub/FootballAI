import { PlayerPosition } from '../types/player';

export const POSITIONS: PlayerPosition[] = ['ST', 'LF', 'RF', 'OM', 'DM', 'IV', 'LV', 'RV'];

export const POSITION_LABELS: Record<PlayerPosition, string> = {
  ST: 'ST',
  LF: 'LF',
  RF: 'RF',
  OM: 'OM',
  DM: 'DM',
  IV: 'IV',
  LV: 'LV',
  RV: 'RV',
  TW: 'TW',
};
