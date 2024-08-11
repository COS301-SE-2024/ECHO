import { Component, Input, OnInit } from "@angular/core";
import { NgClass, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { SearchService, Track } from "../../services/search.service";
import { Observable } from 'rxjs';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { ThemeService } from './../../services/theme.service';
import { Router } from '@angular/router';
import {NavbarComponent} from "./../../shared/navbar/navbar.component";
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { TopResultComponent } from '../../shared/top-result/top-result.component';
import { MoodService } from '../../services/mood-service.service';
import { SpotifyService } from "../../services/spotify.service";
import { ProviderService } from "../../services/provider.service";
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, AsyncPipe, TopResultComponent, NavbarComponent, SearchBarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  //Mood Service Variables
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  @Input() searchQuery!: string;
  songs$: Observable<Track[]>;
  albums$: Observable<Track[]>;
  topResult$: Observable<Track>;
  screenSize?: string;
  title?: string;

  constructor(private screenSizeService: ScreenSizeService,protected themeService: ThemeService,private router: Router,
    public moodService: MoodService,private searchService: SearchService, private spotifyService: SpotifyService, private providerService: ProviderService
  ) {
    this.currentMood = this.moodService.getCurrentMood();
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    this.songs$ = this.searchService.getSearch();
    this.albums$ = this.searchService.getAlbumSearch();
    this.topResult$ = this.searchService.getTopResult();
  }
  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
  onNavChange(newNav: string) {
    this.title = newNav;
  }
  onSearchdown(seaarch:string) {
    this.searchQuery = seaarch;
  }
  switchTheme(): void {
    this.themeService.switchTheme();
  }
  profile() {
    this.router.navigate(['/profile']);
  }

  playTrack(name: string, artistName: string)
  {
    if (this.providerService.getProviderName() === 'spotify')
    {
      this.spotifyService.getTrackDetailsByName(name, artistName).then(async (track) =>
      {
        console.log(track);
        await this.spotifyService.playTrackById(track.id);
      });
    }
  }
}
