import { Component,OnInit } from '@angular/core';
import { SongRecommendationComponent } from '../../shared/song-recommendation/song-recommendation.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ThemeService } from './../../services/theme.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MoodsComponent } from '../../shared/moods/moods.component';
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
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
        SideBarComponent,
        MoodsComponent
        BottomPlayerComponent,
        MoodsComponent,
        BottomNavComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {
    title: string = 'Home';
    screenSize?: string;
    currentSelection: string = 'All';
    constructor(
        protected themeService: ThemeService,
        private authService: AuthService,
        private router: Router,
        private spotifyService: SpotifyService,
        private screenSizeService: ScreenSizeService
    ) {}

  ngOnInit(): void {
    }

    switchTheme(): void {
        this.themeService.switchTheme();
    }

    onNavChange(newNav: string) {
        this.title = newNav;
    }

    ngOnInit() {
        this.screenSizeService.screenSize$.subscribe(screenSize => {
          this.screenSize = screenSize;
        });
    }

    profile() {
        this.router.navigate(['/profile']);
    }
}