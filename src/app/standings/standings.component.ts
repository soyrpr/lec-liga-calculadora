import { Component, OnInit } from '@angular/core';
import { TeamStats } from '../models/TeamStats';
import { StandingsCalculatorService } from '../../services/standings.calculator.service';
import { matches } from '../data/matches';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standings',
  imports: [TableModule, CommonModule],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.scss',
})
export class StandingsComponent implements OnInit{
  standings: TeamStats[] = [];

  constructor(private calculator: StandingsCalculatorService) {

  }

  abs(value: number): number {
    return Math.abs(value);
  }

  ngOnInit(): void {
    this.standings = this.calculator.calculateStandings(matches);
  }
}
