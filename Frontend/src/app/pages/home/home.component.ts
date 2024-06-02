import { Component } from '@angular/core';
import {SongRecommendationComponent} from "../../shared/song-recommendation/song-recommendation.component";
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ThemeService } from './../../services/theme.service';
import { MatSidenav} from '@angular/material/sidenav';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SideBarComponent} from '../../shared/side-bar/side-bar.component';
import {OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SongRecommendationComponent,
    NavbarComponent,
    MatSidenav,
    MatCard,
    MatCardContent,
    NgClass,
    NgForOf,
    NgIf,
    SideBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected title: string  = 'Home';
  constructor(protected themeService: ThemeService, private authService: AuthService, private router: Router) {}



  switchTheme(): void {
    this.themeService.switchTheme();
  }


  onNavChange(newNav: string) {
    this.title = newNav;
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
