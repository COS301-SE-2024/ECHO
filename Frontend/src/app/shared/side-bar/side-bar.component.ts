import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from "../../services/auth.service";
import { firstValueFrom } from "rxjs";
import { ProviderService } from "../../services/provider.service";

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
    private authService: AuthService,
    private providerService: ProviderService
  ) {}

  title: string = 'Home';
  selectedOption: string = 'upNext';

  upNextCardData: any[] = [];
  recentListeningCardData: any[] = [];
  provider: string | null = null;

  async ngOnInit() {
    if (this.providerService.getProviderName() === 'spotify') {
      this.loadUpNextData();
      this.fetchRecentlyPlayedTracks();
      this.provider = await firstValueFrom(this.authService.getProvider());
    }
  }

  async loadUpNextData() {
    if (this.providerService.getProviderName() === 'spotify') {
      try {
        this.upNextCardData = await this.spotifyService.getQueue(this.provider);
      } catch (error) {
        console.error('Error loading up next data:', error);
      }
    }
  }

  private fetchRecentlyPlayedTracks(): void {
    if (this.providerService.getProviderName() === 'spotify') {
      this.spotifyService.getRecentlyPlayedTracks(this.provider).then(data => {
        data.items.forEach((item: any) => {
          const trackId = item.track.id;
          if (!this.recentListeningCardData.find(track => track.id === trackId)) {
            this.recentListeningCardData.push({
              id: trackId,
              imageUrl: item.track.album.images[0].url,
              text: this.truncateText(item.track.name, 33),
              secondaryText: item.track.artists.map((artist: any) => artist.name).join(', '),
              explicit: item.track.explicit
            });
          }
        });
      }).catch(error => {
        console.error('Error fetching recently played tracks:', error);
      });
    }
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
    if (this.providerService.getProviderName() === 'spotify') {
      await this.spotifyService.playTrackById(trackId);
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
