import { PlayerPosition, PlayerWithStats } from '../types/player';
import { Chat } from '../types/chat';
import { Competition } from '../types/stats';
import { POSITIONS } from './positions';

export const DUMMY_MBAPPE: PlayerWithStats = {
  id: 278,
  name: 'Kylian Mbappé',
  firstname: 'Kylian',
  lastname: 'Mbappé',
  age: 27,
  nationality: 'Frankreich',
  nationalityFlag: '🇫🇷',
  height: '1,78',
  preferredFoot: 'Rechts',
  photo: 'https://media.api-sports.io/football/players/278.png',
  position: 'ST',
  team: {
    id: 541,
    name: 'Real Madrid',
    logo: 'https://media.api-sports.io/football/teams/541.png',
  },
  number: 9,
  stats: {
    goals: 25,
    assists: 5,
    xG: 23.95,
    xA: 6.2,
    shots: 146,
    shotsOnTarget: 63,
    touchesInBox: 270,
    successfulCrosses: 6,
    dribbles: 149,
    dribbleSuccessRate: 52.3,
    passes: 998,
    passSuccessRate: 86.5,
    chancesCreated: 65,
    bigChancesCreated: 8,
    tackles: 18,
    tackleSuccessRate: 55,
    interceptions: 2,
    clearances: 2,
    appearances: 31,
    minutesPlayed: 2604,
    rating: 7.56,
  },
};

export const DUMMY_KANE: PlayerWithStats = {
  id: 184,
  name: 'Harry Kane',
  firstname: 'Harry',
  lastname: 'Kane',
  age: 32,
  nationality: 'England',
  nationalityFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  height: '1,88',
  preferredFoot: 'Rechts',
  photo: 'https://media.api-sports.io/football/players/184.png',
  position: 'ST',
  team: {
    id: 157,
    name: 'Bayern München',
    logo: 'https://media.api-sports.io/football/teams/157.png',
  },
  number: 9,
  stats: {
    goals: 36,
    assists: 5,
    xG: 26.87,
    xA: 4.27,
    shots: 93,
    shotsOnTarget: 68,
    touchesInBox: 230,
    successfulCrosses: 10,
    dribbles: 62,
    dribbleSuccessRate: 50,
    passes: 720,
    passSuccessRate: 82.5,
    chancesCreated: 40,
    bigChancesCreated: 18,
    tackles: 12,
    tackleSuccessRate: 50,
    interceptions: 3,
    clearances: 3,
    appearances: 31,
    minutesPlayed: 2382,
    rating: 7.84,
  },
};

export const DUMMY_VINICIUS: PlayerWithStats = {
  id: 1094,
  name: 'Vinícius Jr.',
  firstname: 'Vinícius',
  lastname: 'Júnior',
  age: 25,
  nationality: 'Brasilien',
  nationalityFlag: '🇧🇷',
  height: '1,76',
  preferredFoot: 'Rechts',
  photo: 'https://media.api-sports.io/football/players/1094.png',
  position: 'LF',
  team: {
    id: 541,
    name: 'Real Madrid',
    logo: 'https://media.api-sports.io/football/teams/541.png',
  },
  number: 7,
  stats: {
    goals: 18,
    assists: 11,
    xG: 15,
    xA: 10,
    shots: 72,
    shotsOnTarget: 38,
    touchesInBox: 195,
    successfulCrosses: 41,
    dribbles: 214,
    dribbleSuccessRate: 62.7,
    passes: 523,
    passSuccessRate: 74.8,
    chancesCreated: 52,
    bigChancesCreated: 18,
    tackles: 22,
    tackleSuccessRate: 48,
    interceptions: 12,
    clearances: 4,
    appearances: 30,
    minutesPlayed: 2390,
    rating: 7.8,
  },
};

export const DUMMY_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Meisten Tore in 2026',
    messages: [],
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: '2',
    title: 'Vinicius vs Olise in 25/26',
    messages: [],
    createdAt: new Date('2026-03-12'),
    updatedAt: new Date('2026-03-12'),
  },
  {
    id: '3',
    title: 'Ronaldo vs Messi All Time',
    messages: [],
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
  },
];

/**
 * Rohdaten fuer die Rankings-Liste. Der Score wird nicht gespeichert, sondern
 * in `lib/rankings.ts` aus diesen Stats und dem Score-Modell der Position
 * gerechnet - so stimmt die aufgeklappte Tabelle immer mit dem Score ueberein.
 *
 * Mbappé, Kane und Lautaro tragen echte Saisonzahlen 25/26 (Quellen siehe
 * docs/score-modell.md §9), die uebrigen sind plausibel erfunden.
 */
interface RankingPlayerInput {
  id: number;
  name: string;
  nationality: string;
  nationalityFlag: string;
  teamId: number;
  teamName: string;
  position: PlayerPosition;
  goals: number;
  assists: number;
  bigChancesCreated: number;
  shotsOnTarget: number;
  touchesInBox: number;
  successfulCrosses: number;
  chancesCreated: number;
  dribbles: number;
  dribbleSuccessRate: number;
  appearances: number;
  minutesPlayed: number;
}

function makeRankingPlayer(base: PlayerWithStats, input: RankingPlayerInput): PlayerWithStats {
  const [firstname, ...rest] = input.name.split(' ');
  return {
    ...base,
    id: input.id,
    name: input.name,
    firstname,
    lastname: rest.join(' '),
    nationality: input.nationality,
    nationalityFlag: input.nationalityFlag,
    position: input.position,
    photo: `https://media.api-sports.io/football/players/${input.id}.png`,
    team: {
      id: input.teamId,
      name: input.teamName,
      logo: `https://media.api-sports.io/football/teams/${input.teamId}.png`,
    },
    stats: {
      ...base.stats,
      goals: input.goals,
      assists: input.assists,
      bigChancesCreated: input.bigChancesCreated,
      shotsOnTarget: input.shotsOnTarget,
      touchesInBox: input.touchesInBox,
      successfulCrosses: input.successfulCrosses,
      chancesCreated: input.chancesCreated,
      dribbles: input.dribbles,
      dribbleSuccessRate: input.dribbleSuccessRate,
      appearances: input.appearances,
      minutesPlayed: input.minutesPlayed,
    },
  };
}

const RANKING_ST: PlayerWithStats[] = [
  DUMMY_MBAPPE,
  DUMMY_KANE,
  makeRankingPlayer(DUMMY_MBAPPE, { id: 1100, name: 'Erling Haaland', nationality: 'Norwegen', nationalityFlag: '🇳🇴', teamId: 50, teamName: 'Manchester City', position: 'ST', goals: 29, assists: 3, bigChancesCreated: 6, shotsOnTarget: 59, touchesInBox: 255, successfulCrosses: 2, chancesCreated: 22, dribbles: 45, dribbleSuccessRate: 48.9, appearances: 30, minutesPlayed: 2520 }),
  makeRankingPlayer(DUMMY_KANE, { id: 521, name: 'Lautaro Martínez', nationality: 'Argentinien', nationalityFlag: '🇦🇷', teamId: 505, teamName: 'Inter Mailand', position: 'ST', goals: 17, assists: 6, bigChancesCreated: 12, shotsOnTarget: 39, touchesInBox: 200, successfulCrosses: 3, chancesCreated: 30, dribbles: 44, dribbleSuccessRate: 47.7, appearances: 30, minutesPlayed: 2178 }),
  makeRankingPlayer(DUMMY_KANE, { id: 306, name: 'Viktor Gyökeres', nationality: 'Schweden', nationalityFlag: '🇸🇪', teamId: 42, teamName: 'Arsenal', position: 'ST', goals: 19, assists: 4, bigChancesCreated: 7, shotsOnTarget: 44, touchesInBox: 210, successfulCrosses: 4, chancesCreated: 24, dribbles: 71, dribbleSuccessRate: 52.1, appearances: 32, minutesPlayed: 2610 }),
  makeRankingPlayer(DUMMY_KANE, { id: 909, name: 'Robert Lewandowski', nationality: 'Polen', nationalityFlag: '🇵🇱', teamId: 529, teamName: 'FC Barcelona', position: 'ST', goals: 18, assists: 5, bigChancesCreated: 9, shotsOnTarget: 41, touchesInBox: 188, successfulCrosses: 3, chancesCreated: 27, dribbles: 28, dribbleSuccessRate: 42.9, appearances: 29, minutesPlayed: 2050 }),
  makeRankingPlayer(DUMMY_MBAPPE, { id: 2295, name: 'Victor Osimhen', nationality: 'Nigeria', nationalityFlag: '🇳🇬', teamId: 645, teamName: 'Galatasaray', position: 'ST', goals: 21, assists: 3, bigChancesCreated: 5, shotsOnTarget: 47, touchesInBox: 205, successfulCrosses: 2, chancesCreated: 18, dribbles: 52, dribbleSuccessRate: 50, appearances: 28, minutesPlayed: 2310 }),
  makeRankingPlayer(DUMMY_KANE, { id: 1485, name: 'Alexander Isak', nationality: 'Schweden', nationalityFlag: '🇸🇪', teamId: 40, teamName: 'FC Liverpool', position: 'ST', goals: 16, assists: 6, bigChancesCreated: 10, shotsOnTarget: 43, touchesInBox: 178, successfulCrosses: 5, chancesCreated: 29, dribbles: 66, dribbleSuccessRate: 55.2, appearances: 31, minutesPlayed: 2415 }),
  makeRankingPlayer(DUMMY_MBAPPE, { id: 1483, name: 'Julián Álvarez', nationality: 'Argentinien', nationalityFlag: '🇦🇷', teamId: 530, teamName: 'Atlético Madrid', position: 'ST', goals: 15, assists: 8, bigChancesCreated: 14, shotsOnTarget: 40, touchesInBox: 172, successfulCrosses: 7, chancesCreated: 38, dribbles: 84, dribbleSuccessRate: 51.5, appearances: 32, minutesPlayed: 2640 }),
  makeRankingPlayer(DUMMY_KANE, { id: 2413, name: 'Serhou Guirassy', nationality: 'Guinea', nationalityFlag: '🇬🇳', teamId: 165, teamName: 'Borussia Dortmund', position: 'ST', goals: 14, assists: 4, bigChancesCreated: 6, shotsOnTarget: 75, touchesInBox: 240, successfulCrosses: 3, chancesCreated: 21, dribbles: 40, dribbleSuccessRate: 45, appearances: 30, minutesPlayed: 2400 }),
];

/**
 * Fuer die uebrigen Positionen gibt es in Phase 2 noch keine echten Kader -
 * die Liste wird wie im Figma mit Platzhaltern gefuellt.
 */
function placeholderRanking(position: PlayerPosition): PlayerWithStats[] {
  return Array.from({ length: 10 }, (_, index) =>
    makeRankingPlayer(DUMMY_VINICIUS, {
      id: 90000 + POSITIONS.indexOf(position) * 100 + index,
      name: 'Vorname Nachname',
      nationality: 'Land',
      nationalityFlag: '🏳️',
      teamId: 0,
      teamName: 'Club',
      position,
      goals: 20 - index,
      assists: 12 - index,
      bigChancesCreated: 14 - index,
      shotsOnTarget: 50 - index * 2,
      touchesInBox: 200 - index * 8,
      successfulCrosses: 45 - index * 3,
      chancesCreated: 40 - index * 2,
      dribbles: 150 - index * 8,
      dribbleSuccessRate: 60 - index,
      appearances: 30,
      minutesPlayed: 2400,
    })
  );
}

export const DUMMY_RANKING_PLAYERS: Record<PlayerPosition, PlayerWithStats[]> = {
  ST: RANKING_ST,
  LF: placeholderRanking('LF'),
  RF: placeholderRanking('RF'),
  OM: placeholderRanking('OM'),
  ZM: placeholderRanking('ZM'),
  DM: placeholderRanking('DM'),
  IV: placeholderRanking('IV'),
  LV: placeholderRanking('LV'),
  RV: placeholderRanking('RV'),
  TW: placeholderRanking('TW'),
};

export const DUMMY_COMPETITIONS: Competition[] = [
  { id: 140, name: 'LaLiga', logo: 'https://media.api-sports.io/football/leagues/140.png', season: '25/26' },
  { id: 2, name: 'UEFA Champions League', logo: 'https://media.api-sports.io/football/leagues/2.png', season: '25/26' },
  { id: 143, name: 'Copa del Rey', logo: 'https://media.api-sports.io/football/leagues/143.png', season: '25/26' },
  { id: 556, name: 'Supercopa', logo: 'https://media.api-sports.io/football/leagues/556.png', season: '25/26' },
];

export const DUMMY_SEARCH_PLAYERS = [DUMMY_MBAPPE, DUMMY_KANE, DUMMY_VINICIUS];
