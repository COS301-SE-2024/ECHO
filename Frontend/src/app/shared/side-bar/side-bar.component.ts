import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { SpotifyService } from '../../services/spotify.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { AuthService } from "../../services/auth.service";
import { firstValueFrom } from "rxjs";
import { ProviderService } from "../../services/provider.service";
import { MoodService } from '../../services/mood-service.service';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatCard, MatCardContent, NgForOf, NgIf, NgClass],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
   // Mood Service Variables
   moodComponentClasses!: { [key: string]: string };
   backgroundMoodClasses!: { [key: string]: string };
  constructor(
    protected themeService: ThemeService,
    private spotifyService: SpotifyService,
    private providerService: ProviderService,
    private screenSizeService: ScreenSizeService,
    private authService: AuthService,
    public moodService: MoodService
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
  }

  title: string = 'Home';
  selectedOption: string = 'upNext';

  upNextCardData: any[] = [];
  recentListeningCardData: any[] = [];
  screenSize?: string;
  provider: string | null = null;
  isDropdownVisible: boolean = false;
  selected:string = "Up Next..."
  options = ["Recent Listening...","Up Next..."];

 

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  selectedOptionChange(option:string){
    this.selected = option;
    if(this.selected === 'Recent Listening...'){
      this.selectedOption = 'recentListening';
    }else{
      this.selectedOption = 'upNext';
    }
    this.toggleDropdown();
  }
  async ngOnInit() {
    if (this.providerService.getProviderName() === 'spotify') {
      this.loadUpNextData();
      this.fetchRecentlyPlayedTracks();
      this.provider = await firstValueFrom(this.authService.getProvider());
    }
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
  async loadUpNextData() {
    if (this.providerService.getProviderName() === 'spotify') {
      try {
        this.upNextCardData = await this.spotifyService.getQueue(this.provider);
        this.upNextCardData.unshift(this.getEchoedCardData()[0]);

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
  getRecentListeningCardData(): any[] {
    return this.recentListeningCardData.slice(0, 10);
  }
  getEchoedCardData(): any[] {
    return this.recentListeningCardData.slice(0, 1);
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
