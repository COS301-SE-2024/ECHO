import { Component,OnInit } from '@angular/core';
import { SongRecommendationComponent } from '../../shared/song-recommendation/song-recommendation.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ThemeService } from './../../services/theme.service';
import { NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MoodsComponent } from '../../shared/moods/moods.component';
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import {SearchComponent} from '../../pages/search/search.component';
import {MoodDropDownComponent} from './../../shared/mood-drop-down/mood-drop-down.component';
import {MoodService} from '../../services/mood-service.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        SongRecommendationComponent,
        NavbarComponent,
        NgClass,
        NgForOf,
        NgIf,
        SideBarComponent,
        MoodsComponent,
        SearchBarComponent,
        SearchComponent,
        NgSwitchCase,
        NgSwitch,
        MoodDropDownComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {
    //Mood Service Variables
    currentMood!: string;
    moodComponentClasses!:{ [key: string]: string };
    backgroundMoodClasses!:{ [key: string]: string };
    // Page Variables
    title: string = 'Home';
    screenSize?: string;
    currentSelection: string = 'All';
    searchQuery: string = '';

    constructor(
        protected themeService: ThemeService,
        private authService: AuthService,
        private router: Router,
        private spotifyService: SpotifyService,
        private screenSizeService: ScreenSizeService,
        public moodService: MoodService
    ) {
        this.currentMood = this.moodService.getCurrentMood(); 
        this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
        this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }

    switchTheme(): void {
        this.themeService.switchTheme();
    }

    onNavChange(newNav: string) {
        this.title = newNav;
    }
    onSearchdown(subject:string) {
        this.searchQuery = subject;
        this.title = 'Search';
    }
    async ngOnInit() {
      this.screenSizeService.screenSize$.subscribe(screenSize => {
        this.screenSize = screenSize;
      });
      if (typeof window !== 'undefined') {
        await this.spotifyService.init();
      }
    }

    profile() {
        this.router.navigate(['/profile']);
    }
}
