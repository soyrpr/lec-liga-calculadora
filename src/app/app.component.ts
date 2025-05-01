import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { teams } from './data/teams';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NgFor, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lec-liga-calculadora';
  teams = teams;
}
