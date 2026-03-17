import { PlayerWithStats } from './player';

export type MessageRole = 'user' | 'assistant';
export type ResponseType = 'single' | 'comparison' | 'text';

export interface StatCardData {
  type: 'single';
  player: PlayerWithStats;
}

export interface ComparisonCardData {
  type: 'comparison';
  playerA: PlayerWithStats;
  playerB: PlayerWithStats;
  verdict: string;
}

export type CardData = StatCardData | ComparisonCardData;

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  cardData?: CardData;
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
