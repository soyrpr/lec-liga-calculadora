export interface TeamStats {
  teamName: string;
  seriesWins: number;
  seriesLoss: number;
  seriesWinsRate: number;
  seriesStreak: number;

  gamesWins: number;
  gamesLoss: number;
  gamesWinsRate: number;

  winterSplitPlacement: number;

  headToHead: Record<string, number>;
  strengthOfVictory: number;
}
