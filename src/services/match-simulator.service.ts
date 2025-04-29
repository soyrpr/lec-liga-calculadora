import { matches } from "../app/data/matches";
import { Match } from "../app/models/Matchs";

export type MatchResult = '2-0' | '2-1' | '0-2' | '1-2'
export class MatchSimulatorService {

  simulatMatch(match: Match, result: MatchResult) {
    if(match.winner){
      console.warn('Este partido ya tiene ganador, este cambio sólo serviría para hacer conspiraciones masónicas y no se puede modificar.');
    }

    switch (result){
      case '2-0':
        match.winner = match.teamA;
        match.gamesTeamA = 2;
        match.gamesTeamB = 0;
        break;
      case '2-1':
        match.winner = match.teamA;
        match.gamesTeamA = 2;
        match.gamesTeamB = 1;
        break;
      case '0-2':
        match.winner = match.teamB;
        match.gamesTeamA = 0;
        match.gamesTeamB = 2;
        break;
      case '1-2':
        match.winner = match.teamB;
        match.gamesTeamA = 1;
        match.gamesTeamB = 2;
        break;
    }
  }

  resetSimulations() {
    matches.forEach(match =>{
      if (match.week >= 6 && match.week <= 7 && !this.isResultAlredySet(match)) {
        match.winner = undefined;
        match.gamesTeamA = undefined;
        match.gamesTeamB = undefined;
      }
    })
  }

  getMatchesByWeek(week: number): Match[] {
    return matches.filter(m => m.week === week);
  }

  isResultAlredySet(match: Match): boolean {
    return match.winner !== undefined;
  }
}
