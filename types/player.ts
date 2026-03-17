export type PlayerPosition = 'ST' | 'LF' | 'RF' | 'MI' | 'IV' | 'LV' | 'RV' | 'TW';

export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;
  nationalityFlag: string;
  height: string;
  preferredFoot: string;
  photo: string;
  position: PlayerPosition;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  number: number;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  xG: number;
  xA: number;
  shots: number;
  shotsOnTarget: number;
  dribbles: number;
  dribbleSuccessRate: number;
  passes: number;
  passSuccessRate: number;
  chancesCreated: number;
  bigChancesCreated: number;
  tackles: number;
  tackleSuccessRate: number;
  interceptions: number;
  clearances: number;
  saves?: number;
  conceded?: number;
  cleanSheets?: number;
  appearances: number;
  rating: number;
}

export interface PlayerWithStats extends Player {
  stats: PlayerStats;
  competition?: string;
}
