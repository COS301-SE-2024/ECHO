import { Component, OnInit } from '@angular/core';
import { SpotifyService } from "../../services/spotify.service";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  standalone: true,
  styleUrls: ["./side-bar.component.css"]
})
export class SideBarComponent implements OnInit {
  upNextData: any[] = [];
  recentListeningData: any[] = [];
  selectedOption: string = 'upNext';

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadUpNextData();
    this.loadRecentListeningData();
  }

  async loadUpNextData(): Promise<void> {
    try {
      this.upNextData = await this.spotifyService.getFeaturedPlaylistTracks();
    } catch (error) {
      console.error('Error loading up next data:', error);
    }
  }

  async loadRecentListeningData(): Promise<void> {
    try {
      const data = await this.spotifyService.getRecentlyPlayedTracks();
      this.recentListeningData = data.items.map((item: any) => ({
        text: item.track.name,
        secondaryText: item.track.artists.map((artist: any) => artist.name).join(', '),
        imageUrl: item.track.album.images[0].url,
        explicit: item.track.explicit
      }));
    } catch (error) {
      console.error('Error loading recent listening data:', error);
    }
  }

  getSelectedCardData(): any[] {
    return this.selectedOption === 'upNext' ? this.upNextData : this.recentListeningData;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
  }
}
