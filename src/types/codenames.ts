export type CodenamesRole = 'red' | 'blue' | 'green' | 'neutral' | 'assassin';

export type CodenamesGameMode = 'standard' | '3-team-elegant' | '3-team-epic';
export type CodenamesAssassinRule = 'standard' | 'sudden-death';

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
  gameMode?: CodenamesGameMode;
  assassinRule?: CodenamesAssassinRule;
  cards: CodenamesCard[];
  startingTeam: 'red' | 'blue' | 'green';
  currentTurn: 'red' | 'blue' | 'green';
  redScore: number;
  blueScore: number;
  greenScore?: number;
  winner: 'red' | 'blue' | 'green' | null;
  assassinTriggered: boolean;
  eliminatedTeams?: ('red' | 'blue' | 'green')[];
  timerSeconds: number;
  initialTimerSeconds: number;
  isTimerRunning: boolean;
  customWordBank?: string[];
  currentClue?: CodenamesClue | null;
}
