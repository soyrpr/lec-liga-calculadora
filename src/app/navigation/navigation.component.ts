import { Component } from '@angular/core';
import { teams } from '../data/teams';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, NgFor, RouterLink, ButtonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']  // Corrected to 'styleUrls'
})
export class NavigationComponent {
  teams = teams;
  selectedTeam: { id: string, name: string } | null = null;  // Fix the type

  constructor(private router: Router) {}

  // Navigate to the selected team's page
  navigateToTeam(teamId: string) {
    this.router.navigate(['/teams', teamId]);
  }

  // Select a team and update 'selectedTeam' object
  selectTeam(teamId: string) {
    this.selectedTeam = this.teams.find(team => team.id === teamId) || null;
  }
}
