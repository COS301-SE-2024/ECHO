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
import { PageTitleComponent } from "../../components/atoms/page-title/page-title.component"; // Reuse the interface from ProfileComponent

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

  constructor(
    private router: Router,
    private spotifyService: SpotifyService,
    private screenSizeService: ScreenSizeService
  ) {}

  ngOnInit() {
    // Fetch screen size
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });

    // Fetch top artists and tracks from Spotify API
    this.getTopArtists();
    this.getTopTracks();
  }

  async getTopArtists() {
    this.topArtists = await this.spotifyService.getTopArtists();
  }

  async getTopTracks() {
    this.topTracks = await this.spotifyService.getTopTracks();
  }

  // Play a selected track by ID
  playTrack(id: string) {
    this.spotifyService.playTrackById(id);
  }
}
