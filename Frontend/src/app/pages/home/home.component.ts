import { Component,OnInit } from '@angular/core';
import { SongRecommendationComponent } from '../../shared/song-recommendation/song-recommendation.component';
import { ThemeService } from './../../services/theme.service';
import { NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MoodsComponent } from '../../shared/moods/moods.component';
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { SearchBarComponent } from '../../components/molecules/search-bar/search-bar.component';
import { SearchComponent } from '../../pages/search/search.component';
import { MoodService } from '../../services/mood-service.service';
import { InsightsComponent } from "../insights/insights.component";
import {TopCardComponent} from '../../shared/top-card/top-card.component';
import {TopArtistCardComponent} from "../../shared/top-artist-card/top-artist-card.component";
import {MoodListComponent} from '../../components/molecules/mood-list/mood-list.component';
import { InfoAtomComponent} from '../../components/atoms/info-atom/info-atom.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        SongRecommendationComponent,
        NgClass,
        NgForOf,
        NgIf,
        SideBarComponent,
        MoodsComponent,
        SearchBarComponent,
        SearchComponent,
        NgSwitchCase,
        NgSwitch,
        InsightsComponent,
        TopCardComponent,
        TopArtistCardComponent,
        MoodListComponent,
        InfoAtomComponent
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
    moods = [
        'All', 'Sad', 'Relaxed', 'Energetic',
        'Focused', 'Calm', 'Excited', 'Chill',
        'Melancholic', 'Motivated', 'Joy', 'Admiration', 'Love'
      ];
    selectedMood: number | null = null;

    artists = [
        {
            imageUrl: '../../../assets/images/ken.jpg',
            text: 'Kendrick Lamar',
        },
        {
            imageUrl: '../../../assets/images/malone.jpg',
            text: 'Post Malone',
        },
        {
            imageUrl: '../../../assets/images/thekill.jpg',
            text: 'The Killers',
        },
        {
            imageUrl: '../../../assets/images/rhcp.jpg',
            text: 'Red Hot Chilli Peppers',
        },
        {
            imageUrl: '../../../assets/images/bob.jpg',
            text: 'Bob Marley',
        },
        {
            imageUrl: '../../../assets/images/miller.jpg',
            text: 'Mac Miller',
        },
        {
            imageUrl: '../../../assets/images/cinemaclub.jpg',
            text: 'Two Door Cinema Club',
        },
    ];
    recentListeningCardData = [
        {
            imageUrl: '../../../assets/images/red.jpg',
            text: 'Californication',
            secondaryText: 'Red Hot Chilli Peppers',
            explicit: false,
        },
        {
            imageUrl: '../../../assets/images/post.jpg',
            text: 'Too Cool To Die',
            secondaryText: 'Post Malone',
            explicit: true,
        },
        {
            imageUrl: '../../../assets/images/killers.png',
            text: 'Mr. Brightside',
            secondaryText: 'The Killers',
            explicit: false,
        },
        {
            imageUrl: '../../../assets/images/glass.jpg',
            text: 'Youth',
            secondaryText: 'Glass Animals',
            explicit: false,
        },
        {
            imageUrl: '../../../assets/images/wheatus.jpg',
            text: 'Teenage Dirtbag',
            secondaryText: 'Wheatus',
            explicit: true,
        },
        {
            imageUrl: '../../../assets/images/bastille.jpg',
            text: 'Pompeii',
            secondaryText: 'Bastille',
            explicit: false,
        },
        {
            imageUrl: '../../../assets/images/c.png',
            text: 'Prayer in C',
            secondaryText: 'Lilly Wood & The Prick',
            explicit: false,
        },
    ];
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
