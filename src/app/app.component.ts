import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StandingsComponent } from './standings/standings.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StandingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lec-liga-calculadora';
}
