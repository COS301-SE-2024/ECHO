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
import { BottomPlayerComponent } from '../../shared/bottom-player/bottom-player.component';
import { MoodsComponent } from '../../shared/moods/moods.component';
import { ScreenSizeService } from '../../services/screen-size-service.service';

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
        BottomPlayerComponent,
        MoodsComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
    title: string = 'Home';
    screenSize?: string;

    constructor(
        protected themeService: ThemeService,
        private authService: AuthService,
        private router: Router,
        private screenSizeService: ScreenSizeService
    ) {}

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