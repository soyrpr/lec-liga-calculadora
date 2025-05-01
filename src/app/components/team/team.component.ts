import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { teams } from '../../data/teams';

@Component({
  selector: 'app-team',
  imports: [],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  teamId: string = '';
  team: { id: string; name: string } | undefined;

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('id') || '';
    this.team = teams.find(t => t.id === this.teamId);
  }

  constructor(private route: ActivatedRoute) {}


}
