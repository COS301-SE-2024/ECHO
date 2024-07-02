import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { SpotifyService } from '../../services/spotify.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';

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
    private spotifyService: SpotifyService,
    private screenSizeService: ScreenSizeService
  ) {}

  title: string = 'Home';
  selectedOption: string = 'upNext';

  upNextCardData: any[] = [];
  recentListeningCardData: any[] = [];
  screenSize?: string;
  async ngOnInit() {
    this.loadUpNextData();
    this.fetchRecentlyPlayedTracks();
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
    if (typeof window !== 'undefined') {
      await this.spotifyService.init();
    }
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
            text: this.truncateText(item.track.name,33),
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

  async playTrack(trackId: string): Promise<void> {
    await this.spotifyService.playTrackById(trackId);
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
