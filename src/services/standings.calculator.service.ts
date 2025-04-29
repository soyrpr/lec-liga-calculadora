import { matches } from "../app/data/matches";
import { TeamStats } from "../app/models/TeamStats";

export class StandingsCalculatorService {

  private teamStatsMap: Map<string, TeamStats> = new Map();

  calculateStandings(): TeamStats[] {
    this.resetStats();

    matches.forEach(match =>{
      if (!match.winner) {
        return;
      }

      const teamA = match.teamA;
      const teamB = match.teamB;

      const teamAStats = this.getOrCreateTeam(teamA);
      const teamBStats = this.getOrCreateTeam(teamB);

      //Games
      if (match.gamesTeamA !== undefined && match.gamesTeamB !== undefined){
        teamAStats.gamesWins += match.gamesTeamA;
        teamAStats.gamesLoss += match.gamesTeamB;

        teamBStats.gamesWins += match.gamesTeamB;
        teamBStats.gamesLoss += match.gamesTeamB;
      }

      //Series
      if(match.winner === teamA) {
        teamAStats.seriesWins++;
        teamAStats.seriesStreak++;
        teamBStats.seriesLoss++;
        teamBStats.seriesStreak = Math.min(teamBStats.seriesStreak - 1, -1);
      } else {
        teamBStats.seriesWins++;
        teamBStats.seriesStreak++;
        teamAStats.seriesLoss++;
        teamAStats.seriesStreak = Math.min(teamAStats.seriesStreak -1, -1);
      }
    });

    this.teamStatsMap.forEach(team => {
      const totalSeries = team.seriesWins + team.seriesLoss;
      const totalGames = team.gamesWins + team.gamesLoss;

      team.seriesWinsRate = totalSeries > 0 ? +(team.seriesWins / totalSeries * 100).toFixed(2) : 0;
      team.gamesWinsRate = totalGames > 0 ? +(team.gamesWins / totalGames * 100).toFixed(2) : 0;

    });
    return Array.from(this.teamStatsMap.values());
  }

  private resetStats(){
    this.teamStatsMap.clear();
  }

  getOrCreateTeam(teamA: string): TeamStats {

  }
  }
