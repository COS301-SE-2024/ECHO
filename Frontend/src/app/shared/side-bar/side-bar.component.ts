import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { SpotifyService } from '../../services/spotify.service'; // Ensure the path is correct

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatCard, MatCardContent, NgForOf, NgIf, NgClass],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  constructor(
    protected themeService: ThemeService,
    private spotifyService: SpotifyService
  ) {}

  title: string = 'Home';
  selectedOption: string = 'upNext';

  upNextCardData: any[] = [];
  recentListeningCardData: any[] = [];

  ngOnInit() {
    this.loadUpNextData();
    this.fetchRecentlyPlayedTracks();
  }

  async loadUpNextData() {
    try {
      this.upNextCardData = await this.spotifyService.getQueue();
    } catch (error) {
      console.error('Error loading up next data:', error);
    }
  }

  private fetchRecentlyPlayedTracks(): void {
    this.spotifyService.getRecentlyPlayedTracks().then(data => {
      data.items.forEach((item: any) => {
        const trackId = item.track.id;
        if (!this.recentListeningCardData.find(track => track.id === trackId)) {
          this.recentListeningCardData.push({
            id: trackId,
            imageUrl: item.track.album.images[0].url,
            text: item.track.name,
            secondaryText: item.track.artists.map((artist: any) => artist.name).join(', '),
            explicit: item.track.explicit
          });
        }
      });
    }).catch(error => {
      console.error('Error fetching recently played tracks:', error);
    });
  }

  getSelectedCardData(): any[] {
    return this.selectedOption === 'upNext'
      ? this.upNextCardData
      : this.recentListeningCardData;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  playTrack(trackId: string): void {
    this.spotifyService.playTrackById(trackId);
  }
}
