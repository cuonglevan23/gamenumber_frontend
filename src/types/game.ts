// Game Types
export interface GuessRequest {
  number: number; // 1-5
  winProbability?: number; // 0.01-1.0 (optional)
}

export interface GuessResponse {
  correct: boolean;
  guessedNumber: number;
  actualNumber: number;
  scoreEarned: number; // 0 or 1
  totalScore: number;
  remainingTurns: number;
  message: string;
  gameId: number;
}

export interface GameHistory {
  id: number;
  guessedNumber: number;
  actualNumber: number;
  isCorrect: boolean;
  scoreEarned: number;
  playedAt: string;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
}
