import { Component, OnInit } from '@angular/core';
import { TeamStats } from '../../models/TeamStats';
import { StandingsCalculatorService } from '../../../services/standings.calculator.service';
import { matches } from '../../data/matches';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit {
  standings: TeamStats[] = [];

  constructor(private calculator: StandingsCalculatorService) {}

  abs(value: number): number {
    return Math.abs(value);
  }

  ngOnInit(): void {
    const scenarios: MatchResult[][] = [
      ['2-0', '2-1', '0-2', '1-2', '2-0'], // ejemplo de escenario
      ['2-1', '2-1', '2-0', '2-0', '2-1'], // otro ejemplo
    ];

    this.standings = this.calculator.calculateStandings(matches, scenarios);
  }

  getRowClassPrimeNG(team: TeamStats, rowIndex: number): string {
    const position = rowIndex + 1;

    if (team.eliminated) return 'eliminated';
    if (team.lockedFirst) return 'locked-first';
    if (team.lockedTop4) return 'locked-top4';
    if (team.lockedTop6) return 'locked-top6';

    if (position <= 4) return 'top4';
    if (position <= 6) return 'top6';
    return 'rest';
  }
}
