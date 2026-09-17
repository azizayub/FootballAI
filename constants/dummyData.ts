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
    goals: 30,
    assists: 7,
    xG: 28,
    xA: 6,
    shots: 95,
    shotsOnTarget: 52,
    dribbles: 89,
    dribbleSuccessRate: 56.4,
    passes: 412,
    passSuccessRate: 78.2,
    chancesCreated: 34,
    bigChancesCreated: 12,
    tackles: 18,
    tackleSuccessRate: 55,
    interceptions: 8,
    clearances: 2,
    appearances: 25,
    rating: 7.9,
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
    goals: 24,
    assists: 9,
    xG: 22,
    xA: 8,
    shots: 78,
    shotsOnTarget: 41,
    dribbles: 34,
    dribbleSuccessRate: 41.2,
    passes: 634,
    passSuccessRate: 82.5,
    chancesCreated: 41,
    bigChancesCreated: 15,
    tackles: 12,
    tackleSuccessRate: 50,
    interceptions: 5,
    clearances: 3,
    appearances: 23,
    rating: 7.6,
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
    dribbles: 134,
    dribbleSuccessRate: 62.7,
    passes: 523,
    passSuccessRate: 74.8,
    chancesCreated: 52,
    bigChancesCreated: 18,
    tackles: 22,
    tackleSuccessRate: 48,
    interceptions: 12,
    clearances: 4,
    appearances: 24,
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
 * in `lib/rankings.ts` aus diesen Stats und den Faktoren der Position
 * gerechnet - so stimmt die aufgeklappte Tabelle immer mit dem Score ueberein.
 */
function makeRankingPlayer(
  base: PlayerWithStats,
  overrides: {
    id: number;
    name: string;
    nationality: string;
    nationalityFlag: string;
    teamId: number;
    teamName: string;
    position: PlayerPosition;
    goals: number;
    assists: number;
    chancesCreated: number;
    dribbles: number;
    dribbleSuccessRate: number;
  }
): PlayerWithStats {
  const [firstname, ...rest] = overrides.name.split(' ');
  return {
    ...base,
    id: overrides.id,
    name: overrides.name,
    firstname,
    lastname: rest.join(' '),
    nationality: overrides.nationality,
    nationalityFlag: overrides.nationalityFlag,
    position: overrides.position,
    photo: `https://media.api-sports.io/football/players/${overrides.id}.png`,
    team: {
      id: overrides.teamId,
      name: overrides.teamName,
      logo: `https://media.api-sports.io/football/teams/${overrides.teamId}.png`,
    },
    stats: {
      ...base.stats,
      goals: overrides.goals,
      assists: overrides.assists,
      chancesCreated: overrides.chancesCreated,
      dribbles: overrides.dribbles,
      dribbleSuccessRate: overrides.dribbleSuccessRate,
    },
  };
}

const RANKING_ST: PlayerWithStats[] = [
  DUMMY_MBAPPE,
  DUMMY_KANE,
  makeRankingPlayer(DUMMY_MBAPPE, { id: 1100, name: 'Erling Haaland', nationality: 'Norwegen', nationalityFlag: '🇳🇴', teamId: 50, teamName: 'Manchester City', position: 'ST', goals: 27, assists: 5, chancesCreated: 21, dribbles: 41, dribbleSuccessRate: 48.8 }),
  makeRankingPlayer(DUMMY_KANE, { id: 521, name: 'Lautaro Martínez', nationality: 'Argentinien', nationalityFlag: '🇦🇷', teamId: 505, teamName: 'Inter Mailand', position: 'ST', goals: 20, assists: 6, chancesCreated: 28, dribbles: 55, dribbleSuccessRate: 50.9 }),
  makeRankingPlayer(DUMMY_KANE, { id: 306, name: 'Viktor Gyökeres', nationality: 'Schweden', nationalityFlag: '🇸🇪', teamId: 42, teamName: 'Arsenal', position: 'ST', goals: 22, assists: 4, chancesCreated: 19, dribbles: 63, dribbleSuccessRate: 52.4 }),
  makeRankingPlayer(DUMMY_KANE, { id: 909, name: 'Robert Lewandowski', nationality: 'Polen', nationalityFlag: '🇵🇱', teamId: 529, teamName: 'FC Barcelona', position: 'ST', goals: 19, assists: 5, chancesCreated: 22, dribbles: 30, dribbleSuccessRate: 43.3 }),
  makeRankingPlayer(DUMMY_MBAPPE, { id: 2295, name: 'Victor Osimhen', nationality: 'Nigeria', nationalityFlag: '🇳🇬', teamId: 645, teamName: 'Galatasaray', position: 'ST', goals: 18, assists: 3, chancesCreated: 16, dribbles: 48, dribbleSuccessRate: 50.0 }),
  makeRankingPlayer(DUMMY_KANE, { id: 1485, name: 'Alexander Isak', nationality: 'Schweden', nationalityFlag: '🇸🇪', teamId: 40, teamName: 'FC Liverpool', position: 'ST', goals: 17, assists: 6, chancesCreated: 24, dribbles: 58, dribbleSuccessRate: 55.2 }),
  makeRankingPlayer(DUMMY_MBAPPE, { id: 1483, name: 'Julián Álvarez', nationality: 'Argentinien', nationalityFlag: '🇦🇷', teamId: 530, teamName: 'Atlético Madrid', position: 'ST', goals: 16, assists: 7, chancesCreated: 31, dribbles: 66, dribbleSuccessRate: 51.5 }),
  makeRankingPlayer(DUMMY_KANE, { id: 2413, name: 'Serhou Guirassy', nationality: 'Guinea', nationalityFlag: '🇬🇳', teamId: 165, teamName: 'Borussia Dortmund', position: 'ST', goals: 15, assists: 4, chancesCreated: 17, dribbles: 35, dribbleSuccessRate: 45.7 }),
];

/**
 * Fuer die uebrigen Positionen gibt es in Phase 2 noch keine echten Kader -
 * die Liste wird wie im Figma mit Platzhaltern gefuellt.
 */
function placeholderRanking(position: PlayerPosition): PlayerWithStats[] {
  return Array.from({ length: 10 }, (_, index) =>
    makeRankingPlayer(DUMMY_VINICIUS, {
      id: 90000 + POSITIONS.indexOf(position) * 100 + index,
      name: `Vorname Nachname`,
      nationality: 'Land',
      nationalityFlag: '🏳️',
      teamId: 0,
      teamName: 'Club',
      position,
      goals: 20 - index,
      assists: 12 - index,
      chancesCreated: 40 - index * 2,
      dribbles: 90 - index * 5,
      dribbleSuccessRate: 60 - index,
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
