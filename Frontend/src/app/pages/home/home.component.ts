import { Component,OnInit } from '@angular/core';
import { ThemeService } from './../../services/theme.service';
import { NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { SideBarComponent } from '../../components/organisms/side-bar/side-bar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MoodsComponent } from '../../components/organisms/moods/moods.component';
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { SearchComponent } from '../../pages/search/search.component';
import { MoodService } from '../../services/mood-service.service';
import { InsightsComponent } from "../insights/insights.component";
import {TopCardComponent} from '../../components/molecules/top-card/top-card.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        NgClass,
        NgForOf,
        NgIf,
        SideBarComponent,
        MoodsComponent,
        SearchComponent,
        NgSwitchCase,
        NgSwitch,
        InsightsComponent,
        TopCardComponent,
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

    selectedMood: number | null = null;

    
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
        this.router.navigate(['/home'], { fragment: newNav.toLowerCase() });
    }

    onSearchdown(subject:string) {
        this.searchQuery = subject;
        this.title = 'Search';
        this.router.navigate(['/search']);
    }

    async ngOnInit() {
      this.screenSizeService.screenSize$.subscribe(screenSize => {
        this.screenSize = screenSize;
      });
      if (typeof window !== 'undefined') {
        await this.spotifyService.init();
      } 
    }

   
    selectMood(index: number) {
        this.selectedMood = index;
      }

    getMoodPercentageData(): number[] {
        return [25, 5, 30, 40, 10, 15, 20, 25, 30, 10, 15, 5, 20, 5, 5, 15, 10, 10, 25, 10, 20, 15, 10, 5, 20, 15, 10];
    }
    profile() {
        this.router.navigate(['/profile']);
    }
}
