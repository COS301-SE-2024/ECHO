import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { ArtistInfo, TrackInfo } from '../profile/profile.component';
import { TopArtistCardComponent } from "../../components/molecules/top-artist-card/top-artist-card.component";
import { NavbarComponent } from "../../components/organisms/navbar/navbar.component";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { SearchBarComponent } from "../../components/molecules/search-bar/search-bar.component";
import { TopCardComponent } from "../../components/molecules/top-card/top-card.component";
import { PageTitleComponent } from "../../components/atoms/page-title/page-title.component";
import { ProviderService } from "../../services/provider.service";

@Component({
  selector: 'app-user-library',
  standalone: true,
  templateUrl: './user-library.component.html',
  styleUrl: './user-library.component.css',
  imports: [
    NavbarComponent,
    NgClass,
    NgForOf,
    NgIf,
    SearchBarComponent,
    TopArtistCardComponent,
    TopCardComponent,
    PageTitleComponent
  ]
})
export class UserLibraryComponent implements OnInit {
  public topArtists: ArtistInfo[] = [];
  public topTracks: TrackInfo[] = [];
  screenSize?: string;
  isLoading: boolean = true;
  artistTitle: string | undefined = "Your Top Artists";
  songsTitle: string | undefined = "Your Top Songs";
  pageTitle: string = "Your Library";

  constructor(
    private router: Router,
    private spotifyService: SpotifyService,
    private screenSizeService: ScreenSizeService,
    private providerService: ProviderService
  ) {}

  ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });

    this.getTopArtists();
    this.getTopTracks();
  }

  async getTopArtists() {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.topArtists = await this.spotifyService.getTopArtists();
      this.checkLoading();
    }
    else
    {
      this.artistTitle = "Suggested Artists";
    }
  }

  async getTopTracks() {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.topTracks = await this.spotifyService.getTopTracks();
      this.checkLoading();
    }
    else
    {
      this.songsTitle = "Suggested Songs";
    }
  }

  checkLoading() {
    if (this.topArtists.length > 0 && this.topTracks.length > 0) {
      this.isLoading = false;
    }
  }

  playTrack(id: string) {
    this.spotifyService.playTrackById(id);
  }
}
