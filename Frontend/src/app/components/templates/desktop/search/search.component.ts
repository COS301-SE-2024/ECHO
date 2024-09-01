import { Component, Input, OnInit } from "@angular/core";
import { NgClass, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { SearchService, Track } from "../../../../services/search.service";
import { Observable } from 'rxjs';
import { ScreenSizeService } from '../../../../services/screen-size-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../../../components/organisms/navbar/navbar.component";
import { SearchBarComponent } from '../../../../components/molecules/search-bar/search-bar.component';
import { TopResultComponent } from '../../../../components/molecules/top-result/top-result.component';
import { MoodService } from '../../../../services/mood-service.service';
import { SpotifyService } from "../../../../services/spotify.service";
import { ProviderService } from "../../../../services/provider.service";
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, AsyncPipe, TopResultComponent, NavbarComponent, SearchBarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  // Mood Service Variables
  currentMood!: string;
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };

  @Input() searchQuery!: string;
  songs$: Observable<Track[]>;
  albums$: Observable<Track[]>;
  topResult$: Observable<Track>;
  screenSize?: string;
  title?: string;

  constructor(
    private screenSizeService: ScreenSizeService,
    private router: Router,
    private route: ActivatedRoute,
    public moodService: MoodService,
    private searchService: SearchService,
    private spotifyService: SpotifyService,
    private providerService: ProviderService
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

    // Retrieve the query parameter from the URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
    });
  }

  onNavChange(newNav: string) {
    this.title = newNav;
  }

  onSearchdown(search: string) {
    this.searchQuery = search;
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  playTrack(name: string, artistName: string) {
    if (this.providerService.getProviderName() === 'spotify') {
      this.spotifyService.getTrackDetailsByName(name, artistName).then(async (track) => {
        console.log(track);
        await this.spotifyService.playTrackById(track.id);
      });
    }
  }

  private performSearch(query: string) {
    this.searchService.storeSearch(query).subscribe(
      () => {},
      error => console.error('Error performing search:', error)
    );
    this.searchService.storeAlbumSearch(query).subscribe(
      () => {},
      error => console.error('Error performing search:', error)
    );
  }
}