import { Component, Input, OnInit } from "@angular/core";
import { NgClass, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { AlbumTrack, SearchService, TrackInfo } from "../../../../services/search.service";
import { Observable } from "rxjs";
import { ScreenSizeService } from "../../../../services/screen-size-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NavbarComponent } from "../../../../components/organisms/navbar/navbar.component";
import { SearchBarComponent } from "../../../../components/molecules/search-bar/search-bar.component";
import { TopResultComponent } from "../../../../components/molecules/top-result/top-result.component";
import { MoodService } from "../../../../services/mood-service.service";
import { SpotifyService } from "../../../../services/spotify.service";
import { ProviderService } from "../../../../services/provider.service";
import { YouTubeService } from "../../../../services/youtube.service";
import { BackButtonComponent } from "../../../atoms/back-button/back-button.component";
import { SongCardsComponent } from "../../../organisms/song-cards/song-cards.component";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, AsyncPipe, TopResultComponent, NavbarComponent, SearchBarComponent, BackButtonComponent, SongCardsComponent],
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  // Mood Service Variables
  currentMood!: string;
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };

  @Input() searchQuery!: string;
  songs$: Observable<TrackInfo[]>;
  albums$: Observable<AlbumTrack[]>;
  topResult$: Observable<TrackInfo>;
  screenSize?: string;
  title?: string;

  constructor(
    private screenSizeService: ScreenSizeService,
    private router: Router,
    public route: ActivatedRoute,
    public moodService: MoodService,
    private searchService: SearchService,
    private spotifyService: SpotifyService,
    private providerService: ProviderService,
    private youtubeService: YouTubeService
  ) {
    this.currentMood = this.moodService.getCurrentMood();
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
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
      this.searchQuery = params["query"] || "";
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
    this.router.navigate(["/profile"]);
  }

  playTrack(text: string, secondaryText: string) {
    if (this.providerService.getProviderName() === "spotify") {
      this.spotifyService.getTrackDetailsByName(text, secondaryText).then(async (track) => {
        console.log(track);
        await this.spotifyService.playTrackById(track.id);
      });
    } else {
      this.youtubeService.getTrackByName(text, secondaryText).then(async (track) => {
        await this.youtubeService.playTrackById(track.id);
      });
    }
  }

  private performSearch(query: string) {
    this.searchService.storeSearch(query).subscribe(
      () => {
        // Handle successful search
      },
      error => console.error("Error performing search:", error)
    );
    this.searchService.storeAlbumSearch(query).subscribe(
      () => {
        // Handle successful album search
      },
      error => console.error("Error performing album search:", error)
    );
  }

  onEchoTrackEvent(event: {
    trackName: string;
    artistName: string;
    event: MouseEvent
  }, text: string, secondaryText: string)
  {
      event.event.stopPropagation();
      this.router.navigate(['/echo Song'], {
        queryParams: {
          trackName: text,
          artistName: secondaryText
        }
      });
    }
}
