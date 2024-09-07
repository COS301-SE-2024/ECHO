import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { SpotifyService } from "../../../services/spotify.service";
import { ScreenSizeService } from "../../../services/screen-size-service.service";
import { AuthService } from "../../../services/auth.service";
import { firstValueFrom } from "rxjs";
import { ProviderService } from "../../../services/provider.service";
import { MoodService } from "../../../services/mood-service.service";
import { EchoButtonComponent } from "../../atoms/echo-button/echo-button.component";
import { YouTubeService } from "../../../services/youtube.service";
import { SongCardsComponent } from "..//song-cards/song-cards.component";
import { SearchService } from "../../../services/search.service";

@Component({
  selector: "app-side-bar",
  standalone: true,
  imports: [MatCard, MatCardContent, NgForOf, NgIf, NgClass, EchoButtonComponent, SongCardsComponent],
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"]
})
export class SideBarComponent implements OnInit
{
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
  selectedOption: string = "upNext";

  upNextCardData: any[] = [];
  recentListeningCardData: any[] = [];
  echoTracks: any[] = [];
  screenSize?: string;
  provider: string | null = null;
  isDropdownVisible: boolean = false;
  selected: string = "Up Next...";
  options = ["Recent Listening...", "Up Next..."];
  isEchoModalVisible: boolean = false;

  async ngAfterViewInit() {
    this.cdRef.detectChanges(); // Manually trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
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

  selectedOptionChange(option: string)
  {
    this.selected = option;
    if (this.selected === "Recent Listening...")
    {
      this.selectedOption = "recentListening";
    }
    else
    {
      this.selectedOption = "upNext";
    }
    this.toggleDropdown();
  }

  async ngOnInit()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.loadUpNextData();
      await this.fetchRecentlyPlayedTracks();
      this.provider = await firstValueFrom(this.authService.getProvider());
    }
    else
    {
      this.provider = "youtube";
      this.loadUpNextData(); // Do not await this to allow rendering
      this.fetchRecentlyPlayedTracks(); // Do not await this to allow rendering
      this.youtubeService.init(); // Initialize YouTube Player asynchronously
    }

    this.screenSizeService.screenSize$.subscribe(screenSize =>
    {
      this.screenSize = screenSize;
    });
  }

  async loadUpNextData()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      try
      {
        this.upNextCardData = await this.spotifyService.getQueue(this.provider);
        await this.upNextCardData.unshift(this.getEchoedCardData()[0]);
      }
      catch (error)
      {
        console.error("Error loading up next data:", error);
      }
    }
  }

  private fetchRecentlyPlayedTracks(): void
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.getRecentlyPlayedTracks(this.provider).then(data =>
      {
        console.log("Recently Played Tracks Data:", data);
        data.items.forEach((item: any) =>
        {
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
      }).catch(error =>
      {
        console.error("Error fetching recently played tracks:", error);
      });
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
      }).catch(error =>
      {
        console.error("Error fetching top YouTube tracks:", error);
      });
    }
  }

  getSelectedCardData(): any[]
  {
    return this.selectedOption === "upNext"
      ? this.upNextCardData
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

  selectOption(option: string)
  {
    this.selectedOption = option;
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
    event.stopPropagation();
    this.searchService.echo(trackName, artistName).then(tracks =>
    {
      this.echoTracks = tracks;
      this.isEchoModalVisible = true;
    }).catch(error =>
    {
      console.error("Error echoing track: ", error);
    });
  }

  private truncateText(text: string | null | undefined, maxLength: number): string
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
}
