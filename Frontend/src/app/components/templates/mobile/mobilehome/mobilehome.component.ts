import { Component, OnInit, ViewChild, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { firstValueFrom } from "rxjs";

import { SpotifyService } from "../../../../services/spotify.service";
import { ScreenSizeService } from "../../../../services/screen-size-service.service";
import { AuthService } from "../../../../services/auth.service";
import { ProviderService } from "../../../../services/provider.service";
import { MoodService } from "../../../../services/mood-service.service";
import { SearchService } from "../../../../services/search.service";
import { YouTubeService } from "../../../../services/youtube.service";
import { Router } from "@angular/router";
import { EchoButtonComponent } from "../../../atoms/echo-button/echo-button.component";
import { SongCardsComponent } from "../../../organisms/song-cards/song-cards.component";
import { SkeletonSongCardComponent } from "../../../atoms/skeleton-song-card/skeleton-song-card.component";
import { ToastComponent } from "../../../../components/organisms/toast/toast.component";
import { MoodsComponent } from '../../../organisms/moods/moods.component';

type SelectedOption = "suggestions" | "recentListening";

@Component({
  selector: 'app-mobilehome',
  standalone: true,
  imports: [
    MatCard, MatCardContent, NgForOf, NgIf, NgClass,
    EchoButtonComponent, SongCardsComponent, SkeletonSongCardComponent,
    ToastComponent, MoodsComponent
  ],
  templateUrl: './mobilehome.component.html',
  styleUrls: ['./mobilehome.component.css']
})
export class MobilehomeComponent implements OnInit
{
  @ViewChild(ToastComponent) toastComponent!: ToastComponent; // Declare ToastComponent
  @Output() sidebarToggled = new EventEmitter<boolean>(); // Declare EventEmitter

  // Mood Service Variables
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  underline!: { [key: string]: string };

  constructor(
    private spotifyService: SpotifyService,
    private providerService: ProviderService,
    private screenSizeService: ScreenSizeService,
    private authService: AuthService,
    private searchService: SearchService,
    public moodService: MoodService,
    private youtubeService: YouTubeService,
    private cdRef: ChangeDetectorRef,
    private route: Router
  )
  {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.underline = this.moodService.getUnerlineMoodClasses();
  }

  title: string = "Home";
  selectedOption: SelectedOption = "recentListening";

  suggestionsCardData: any[] = [];
  recentListeningCardData: any[] = [];
  echoTracks: any[] = [];
  provider: string | null = null;
  isDropdownVisible: boolean = true;
  selected: string = "Recent Listening...";
  options = ["Recent Listening...", "Suggestions..."];
  isEchoModalVisible: boolean = false;
  isLoading: boolean = true;
  showOption: boolean = false;
  skeletonArray = Array(10);

   toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  showOptions(): void {
    this.showOption = !this.showOption;
  }

  getButtonClasses(option: string): { [key: string]: boolean }
  {
    const moodClass = this.underline[this.moodService.getCurrentMood()];
    return {
      [moodClass]: this.selectedOption === option,
      "border-transparent": this.selectedOption !== option
    };
  }

  async selectedOptionChange(option: string) {
    this.selected = option;
    this.isDropdownVisible = true;
    this.isLoading = true;
    if (this.selected === "Recent Listening...") {
      this.selectedOption = "recentListening";
      await this.fetchRecentlyPlayedTracks();
    } else {
      this.selectedOption = "suggestions";
      await this.loadSuggestionsData();
    }
    this.isLoading = false;
  }

  async ngOnInit()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.loadSuggestionsData();
      await this.fetchRecentlyPlayedTracks();
      this.provider = await firstValueFrom(this.authService.getProvider());
    }
    else
    {
      this.provider = "youtube";
      await this.loadUpNextData();
      await this.fetchRecentlyPlayedTracks();
      await this.youtubeService.init();
    }
  }

  async loadUpNextData()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      try
      {
        this.suggestionsCardData = await this.spotifyService.getQueue(this.provider);
        await this.suggestionsCardData.unshift(this.getEchoedCardData()[0]);
      } catch (error) {
        console.error("Error loading up next data:", error);
      }
    }
  }

  async loadSuggestionsData()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      try
      {
        this.isLoading = true;
        this.suggestionsCardData = await this.spotifyService.getQueue(this.provider);
        console.log(this.suggestionsCardData);
        
        await this.suggestionsCardData.unshift(this.getEchoedCardData()[0]);
        this.isLoading = false;
      }
      catch (error)
      {
        this.isLoading = false;
        console.error("Error fetching suggestions:", error); // Log the error
        console.log(this.selectedOption);
        if (this.selectedOption === "suggestions") {
            console.log("In error");
            this.toastComponent.showToast("Error fetching suggestions data", "error"); // Show error toast
        }
      }
    }
  }

  private async fetchRecentlyPlayedTracks()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      try
      {
        this.isLoading = true;
        const data = await this.spotifyService.getRecentlyPlayedTracks(this.provider);
        console.log("First track: ", data.items[0]);
        console.log("First track: ", data.items[0]);
        data.items.forEach((item: any) => {
          const trackId = item.track.id;
          if (!this.recentListeningCardData.find(track => track.id === trackId))
          {
            this.recentListeningCardData.push({
              id: trackId,
              imageUrl: item.track.album.images[0].url,
              text: this.truncateText(item.track.name, 33),
              secondaryText: item.track.artists.map((artist: any) => artist.name).join(", "),
              explicit: item.track.explicit
            });
          }
        });
        this.isLoading = false;
      }
      catch (error)
      {
        this.isLoading = false;
        if (this.selectedOption === "recentListening")
        {
          this.toastComponent.showToast("Error fetching recently played tracks", "error");
        }
      }
    }
    else
    {
      this.youtubeService.getTopYouTubeTracks().then(tracks =>
      {
        if (tracks)
        {
          tracks.forEach(track =>
          {
            const trackId = track.id;
            if (!this.recentListeningCardData.find(t => t.id === trackId))
            {
              this.recentListeningCardData.push({
                id: trackId,
                imageUrl: track.imageUrl,
                text: this.truncateText(track.text, 33),
                secondaryText: track.secondaryText,
                explicit: false
              });
            }
          });
        }
        else
        {
          console.error("No tracks found in YouTube top tracks.");
        }
        this.isLoading = false;
      }).catch(error =>
      {
        this.isLoading = false;
        if (this.selectedOption === "recentListening")
        {
          this.toastComponent.showToast("Error fetching recently played tracks", "error");
        }
      });
    }
  }

  getSelectedCardData(): any[]
  {
    return this.selectedOption === "suggestions"
      ? this.suggestionsCardData
      : this.recentListeningCardData;
  }

  getRecentListeningCardData(): any[]
  {
    return this.recentListeningCardData.slice(0, 15);
  }

  getEchoedCardData(): any[]
  {
    return this.recentListeningCardData.slice(0, 1);
  }

  selectOption(option: SelectedOption) {
    this.selectedOption = option;
    this.isLoading = true;
    if (option === 'suggestions') {
      this.toastComponent.hideToast();
      this.loadSuggestionsData().finally(() => this.isLoading = false);
    } else {
      this.toastComponent.hideToast();
      this.fetchRecentlyPlayedTracks().finally(() => this.isLoading = false);
    }
  }

  async playTrack(trackId: string): Promise<void>
  {
    console.log(`Attempting to play track with ID: ${trackId}`);
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.spotifyService.playTrackById(trackId);
    }
    else
    {
      console.log("Invoking YouTube playTrackById");
      await this.youtubeService.playTrackById(trackId);
    }
  }

  async echoTrack(trackName: string, artistName: string, event: MouseEvent): Promise<void>
  {
    this.isEchoModalVisible = true;
    event.stopPropagation();
    try
    {
      this.echoTracks = await this.searchService.echo(trackName, artistName);
      this.isEchoModalVisible = true;
    }
    catch (error)
    {
      console.error("Error echoing track: ", error);
      this.toastComponent.showToast("Error echoing track", "error"); // Show error toast
    }
  }

  private truncateText(text: string, maxLength: number): string
  {
    if (!text)
    {
      return "";
    }
    if (text.length > maxLength)
    {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  closeModal()
  {
    this.isEchoModalVisible = false;
  }
  goToLibrary() {
    this.route.navigate(['/library']); // Use router.navigate
  }
  handleEchoTrack(eventData: { trackName: string, artistName: string, event: MouseEvent })
  {
    // this.echoTrack(eventData.trackName, eventData.artistName, eventData.event);
  }
}