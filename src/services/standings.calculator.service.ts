import { matches } from "../app/data/matches";
import { Match } from "../app/models/Matchs";
import { TeamStats } from "../app/models/TeamStats";
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StandingsCalculatorService {
  private teamStatsMap: Map<string, TeamStats> = new Map();

  calculateStandings(matches: Match[], scenarios: string[][]): TeamStats[] {
    this.resetStats();

    matches.forEach(match => {
      if (!match.winner) return;

      const teamA = match.teamA;
      const teamB = match.teamB;

      const teamAStats = this.getOrCreateTeam(teamA);
      const teamBStats = this.getOrCreateTeam(teamB);

      // Juegos
      if (match.gamesTeamA !== undefined && match.gamesTeamB !== undefined) {
        teamAStats.gamesWins += match.gamesTeamA;
        teamAStats.gamesLoss += match.gamesTeamB;

        teamBStats.gamesWins += match.gamesTeamB;
        teamBStats.gamesLoss += match.gamesTeamA;
      }

      // Series
      if (match.winner === teamA) {
        teamAStats.seriesWins++;
        teamAStats.seriesStreak = teamAStats.seriesStreak >= 0 ? teamAStats.seriesStreak + 1 : 1;

        teamBStats.seriesLoss++;
        teamBStats.seriesStreak = teamBStats.seriesStreak <= 0 ? teamBStats.seriesStreak - 1 : -1;
      } else {
        teamBStats.seriesWins++;
        teamBStats.seriesStreak = teamBStats.seriesStreak >= 0 ? teamBStats.seriesStreak + 1 : 1;

        teamAStats.seriesLoss++;
        teamAStats.seriesStreak = teamAStats.seriesStreak <= 0 ? teamAStats.seriesStreak - 1 : -1;
      }

      // Actualizar enfrentamientos directos
      teamAStats.headToHead[teamB] = teamAStats.headToHead[teamB] ?? 0;
      teamBStats.headToHead[teamA] = teamBStats.headToHead[teamA] ?? 0;

      if (match.winner === teamA) {
        teamAStats.headToHead[teamB]++;
      } else {
        teamBStats.headToHead[teamA]++;
      }
    });

    // Calcular ratios
    this.teamStatsMap.forEach(team => {
      const totalSeries = team.seriesWins + team.seriesLoss;
      const totalGames = team.gamesWins + team.gamesLoss;

      team.seriesWinsRate = totalSeries > 0 ? +(team.seriesWins / totalSeries * 100).toFixed(2) : 0;
      team.gamesWinsRate = totalGames > 0 ? +(team.gamesWins / totalGames * 100).toFixed(2) : 0;
    });

    const standings = this.sortStandings(Array.from(this.teamStatsMap.values()));
    this.assignSoV(standings, matches);
    return standings;
  }

  private resetStats() {
    this.teamStatsMap.clear();
  }

  private getOrCreateTeam(teamName: string): TeamStats {
    if (!this.teamStatsMap.has(teamName)) {
      this.teamStatsMap.set(teamName, {
        teamName,
        seriesWins: 0,
        seriesLoss: 0,
        seriesWinsRate: 0,
        seriesStreak: 0,
        gamesWins: 0,
        gamesLoss: 0,
        gamesWinsRate: 0,
        winterSplitPlacement: 0,
        headToHead: {},
        strengthOfVictory: 0,
        positionProbabilities: []
      });
    }
    return this.teamStatsMap.get(teamName)!;
  }

  private sortStandingsWithoutSoV(teams: TeamStats[]): TeamStats[] {
    return teams.sort((a, b) => {
      const gameDiff = (b.gamesWins - b.gamesLoss) - (a.gamesWins - a.gamesLoss);
      if (gameDiff !== 0) return gameDiff;

      const hthComparison = this.compareHeadToHead(a, b);
      if (hthComparison !== 0) return hthComparison;

      return a.winterSplitPlacement - b.winterSplitPlacement;
    });
  }

  private sortStandings(teams: TeamStats[]): TeamStats[] {
    return teams.sort((a, b) => {
      const gameDiff = (b.gamesWins - b.gamesLoss) - (a.gamesWins - a.gamesLoss);
      if (gameDiff !== 0) return gameDiff;

      const hthComparison = this.compareHeadToHead(a, b);
      if (hthComparison !== 0) return hthComparison;

      if (a.winterSplitPlacement !== b.winterSplitPlacement) {
        return a.winterSplitPlacement - b.winterSplitPlacement;
      }

      return b.strengthOfVictory - a.strengthOfVictory;
    });
  }

  private compareHeadToHead(a: TeamStats, b: TeamStats): number {
    const hthA = a.headToHead[b.teamName] ?? 0;
    const hthB = b.headToHead[a.teamName] ?? 0;
    return hthB - hthA;
  }

  private assignSoV(teams: TeamStats[], matches: Match[]) {
    const pointsByPosition: Record<number, number> = {
      1: 10, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1
    };

    // Resetear SoV
    teams.forEach(team => {
      team.strengthOfVictory = 0;
    });

    // Ordenar standings para calcular posiciones
    const sortedByWinrate = [...teams].sort((a, b) => b.seriesWinsRate - a.seriesWinsRate);

    const positionMap: Map<string, number> = new Map();
    let currentPosition = 1;
    let i = 0;

    while (i < sortedByWinrate.length) {
      const group = [sortedByWinrate[i]];
      let j = i + 1;

      while (
        j < sortedByWinrate.length &&
        sortedByWinrate[j].seriesWinsRate === sortedByWinrate[i].seriesWinsRate
      ) {
        group.push(sortedByWinrate[j]);
        j++;
      }

      // Todos en el grupo reciben la misma posición
      group.forEach(team => {
        positionMap.set(team.teamName, currentPosition); // Asigna la misma posición a todos los equipos en el grupo
      });

      currentPosition += group.length; // Avanzar al siguiente grupo de equipos
      i = j;
    }

    // Mostrar las posiciones asignadas
    console.log('Posiciones asignadas:', Array.from(positionMap.entries()));

// Sumamos SoV por CADA victoria
matches.forEach(match => {
  if (!match.winner) return;

  const loser = match.winner === match.teamA ? match.teamB : match.teamA;
  const winnerStats = this.teamStatsMap.get(match.winner);
  const loserPosition = positionMap.get(loser);

  if (winnerStats && loserPosition !== undefined) {
    const points = pointsByPosition[loserPosition] ?? 0;
    winnerStats.strengthOfVictory += points;

    console.log(`${loser} da a ${match.winner} ${points} puntos de SoV`);
  }
});
  }


  private compareTeamsForSoV(a: TeamStats, b: TeamStats): number {
    const gameDiffA = a.gamesWins - a.gamesLoss;
    const gameDiffB = b.gamesWins - b.gamesLoss;
    if (gameDiffA !== gameDiffB) return gameDiffB - gameDiffA;

    const hthComparison = this.compareHeadToHead(a, b);
    if (hthComparison !== 0) return hthComparison;

    if (a.winterSplitPlacement !== b.winterSplitPlacement) {
      return a.winterSplitPlacement - b.winterSplitPlacement;
    }

    return b.strengthOfVictory - a.strengthOfVictory;
  }

}
