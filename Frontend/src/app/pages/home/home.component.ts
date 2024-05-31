import { Component } from '@angular/core';
import {SongRecommendationComponent} from "../../shared/song-recommendation/song-recommendation.component";
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ThemeService } from './../../services/theme.service';  

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SongRecommendationComponent,
    NavbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private themeService: ThemeService) {}

  switchTheme(): void {
    this.themeService.switchTheme();
  }

  isDarkModeActive(): boolean {
    return this.themeService.isDarkModeActive();
  }
}
