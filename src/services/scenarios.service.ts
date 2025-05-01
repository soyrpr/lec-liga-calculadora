import { Injectable } from '@angular/core';

type MatchResult = '2-0' | '2-1' | '1-2' | '0-2';

export interface Match {
  week: number;
  teamA: string;
  teamB: string;
}

export interface Scenario {
  results: MatchResult[];
}

@Injectable({
  providedIn: 'root',
})
export class SimulacionMontecarloService {
  private readonly posiblesResultados: MatchResult[] = ['2-0', '2-1', '1-2', '0-2'];

  getAllCombinations(matches: Match[]): Scenario[] {
    const total = Math.pow(this.posiblesResultados.length, matches.length);
    const escenarios: Scenario[] = [];

    for (let i = 0; i < total; i++) {
      let n = i;
      const results: MatchResult[] = [];

      for (let j = 0; j < matches.length; j++) {
        const idx = n % this.posiblesResultados.length;
        results.push(this.posiblesResultados[idx]);
        n = Math.floor(n / this.posiblesResultados.length);
      }

      escenarios.push({ results });
    }

    return escenarios;
  }
}
