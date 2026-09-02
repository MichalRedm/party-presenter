export type CodenamesRole = 'red' | 'blue' | 'neutral' | 'assassin';

export interface CodenamesCard {
  id: number;
  word: string;
  role: CodenamesRole;
  revealed: boolean;
}

export interface CodenamesClue {
  word: string;
  count: number;
}

export interface CodenamesConfig {
  cards: CodenamesCard[];
  startingTeam: 'red' | 'blue';
  currentTurn: 'red' | 'blue';
  redScore: number;
  blueScore: number;
  winner: 'red' | 'blue' | null;
  assassinTriggered: boolean;
  timerSeconds: number;
  initialTimerSeconds: number;
  isTimerRunning: boolean;
  customWordBank?: string[];
  currentClue?: CodenamesClue | null;
}
