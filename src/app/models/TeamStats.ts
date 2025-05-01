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

  headToHead: { [opponent: string]: number };
  strengthOfVictory: number;
  positionProbabilities: number[];

  eliminated?: boolean;
  lockedFirst?: boolean;
  lockedTop4?: boolean;
  lockedPlayoffs?: boolean;
  lockedTop6?: any;
}
