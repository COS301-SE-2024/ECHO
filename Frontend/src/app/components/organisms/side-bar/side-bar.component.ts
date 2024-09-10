import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { SpotifyService } from "../../../services/spotify.service";
import { ScreenSizeService } from "../../../services/screen-size-service.service";
import { AuthService } from "../../../services/auth.service";
import { firstValueFrom } from "rxjs";
import { ProviderService } from "../../../services/provider.service";
import { MoodService } from "../../../services/mood-service.service";
import { EchoButtonComponent } from "../../atoms/echo-button/echo-button.component";
import { SongCardsComponent } from "../song-cards/song-cards.component";
import { SearchService } from "../../../services/search.service";
import { SkeletonSongCardComponent } from "../../atoms/skeleton-song-card/skeleton-song-card.component";
import { ToastComponent } from "../../../components/organisms/toast/toast.component";
import { YouTubeService } from "../../../services/youtube.service";
import { ExpandableIconComponent } from '../../organisms/expandable-icon/expandable-icon.component';

type SelectedOption = "suggestions" | "recentListening";

@Component({
  selector: "app-side-bar",
  standalone: true,
  imports: [MatCard, MatCardContent, NgForOf, NgIf, NgClass, EchoButtonComponent, SongCardsComponent, SkeletonSongCardComponent, ToastComponent,ExpandableIconComponent],
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"]
})
export class SideBarComponent implements OnInit
{
  @ViewChild(ToastComponent) toastComponent!: ToastComponent; // Declare ToastComponent

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
    private cdRef: ChangeDetectorRef
  )
  {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    this.underline = this.moodService.getUnerlineMoodClasses();
  }

  title: string = "Home";
  selectedOption: SelectedOption = "recentListening";

  suggestionsCardData: any[] = [];
  recentListeningCardData: any[] = [];
  echoTracks: any[] = [];
  provider: string | null = null;
  isDropdownVisible: boolean = false;
  selected: string = "Up Next...";
  options = ["Recent Listening...", "Up Next..."];
  isEchoModalVisible: boolean = false;
  isLoading: boolean = true;
  skeletonArray = Array(10);

  async ngAfterViewInit()
  {
    this.cdRef.detectChanges();
  }

  toggleDropdown(): void
  {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  getButtonClasses(option: string): { [key: string]: boolean }
  {
    const moodClass = this.underline[this.moodService.getCurrentMood()];
    return {
      [moodClass]: this.selectedOption === option,
      "border-transparent": this.selectedOption !== option
    };
  }

  selectedOptionChange(option: string) {
    this.selected = option;
    if (this.selected === "Recent Listening...") {
      this.selectedOption = "recentListening";
    } else {
      this.selectedOption = "suggestions";
    }
    this.toggleDropdown();
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
      }
      catch (error)
      {
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
        await this.suggestionsCardData.unshift(this.getEchoedCardData()[0]);
        this.isLoading = false;
      }
      catch (error)
      {
        this.isLoading = false;
        if (this.selectedOption === "suggestions")
        {
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
          this.toastComponent.showToast("Error fetching recently played tracks", "error"); // Show error toast
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
              this.isLoading = false;
            }
          });
        }
        else
        {
          console.error("No tracks found in YouTube top tracks.");
        }
      }).catch(error =>
      {
        this.isLoading = false;
        console.error("Error fetching top YouTube tracks:", error);
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
      this.loadSuggestionsData();
    } else {
      this.toastComponent.hideToast();
      this.fetchRecentlyPlayedTracks();
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

  handleEchoTrack(eventData: { trackName: string, artistName: string, event: MouseEvent })
  {
    // this.echoTrack(eventData.trackName, eventData.artistName, eventData.event);
  }
}
