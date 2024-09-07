import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { NgIf, NgClass } from "@angular/common";
import { SpotifyService } from "../../../services/spotify.service";
import { ScreenSizeService } from "../../../services/screen-size-service.service";
import { Subscription, interval } from "rxjs";
import { ProviderService } from "../../../services/provider.service";
import { MoodService } from "../../../services/mood-service.service";
import { YouTubeService } from "../../../services/youtube.service";

@Component({
  selector: "app-bottom-player",
  standalone: true,
  imports: [MatCard, MatCardContent, NgIf, NgClass],
  templateUrl: "./bottom-player.component.html",
  styleUrls: ["./bottom-player.component.css"]
})
export class BottomPlayerComponent implements AfterViewInit, OnDestroy
{
  @ViewChild("progressContainer") private progressContainer!: ElementRef;
  protected imgsrc: string = "../../../assets/images/play.png";
  playing: boolean = false;
  started: boolean = false;
  screenSize?: string;

  //Mood Service Variables
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  moodClassesDark!: { [key: string]: string };
  currentTrack: any = {
    name: "All In",
    artist: "Nasty C ft. TI",
    imageUrl: "../../../assets/images/nasty.jpg",
    explicit: true,
    duration_ms: 0
  };
  trackProgress: number = 0;
  private trackSubscription!: Subscription;
  private playingStateSubscription!: Subscription;
  private progressSubscription!: Subscription;
  private progressUpdateSubscription!: Subscription;
  public muted: boolean = false;


  constructor(
    private spotifyService: SpotifyService,
    private screenSizeService: ScreenSizeService,
    private providerService: ProviderService,
    public moodService: MoodService,
    private cdr: ChangeDetectorRef,
    private youtubeService: YouTubeService
  )
  {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    this.moodClassesDark = this.moodService.getComponentMoodClassesDark();
  }


  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });

    // Ensure window is available before interacting with it
    if (typeof window !== "undefined") {
      const providerName = this.providerService.getProviderName();

      // Check if Spotify is the selected provider
      if (providerName === "spotify") {
        try {
          await this.spotifyService.init();
          console.log("Spotify service initialized.");
        } catch (error) {
          console.error("Error initializing Spotify service:", error);
        }
      }
      // Otherwise, assume YouTube is the selected provider
      else if (providerName === "youtube") {
        try {
          await this.youtubeService.init(); // Ensure YouTube is initialized
          console.log("YouTube service initialized.");
        } catch (error) {
          console.error("Error initializing YouTube service:", error);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    const providerName = this.providerService.getProviderName();

    // Subscribe to Spotify events
    if (providerName === "spotify") {
      this.trackSubscription = this.spotifyService.currentlyPlayingTrack$.subscribe(track => {
        if (track) {
          this.currentTrack = {
            name: track.name,
            artist: track.artists.map((artist: any) => artist.name).join(", "),
            imageUrl: track.album.images[0]?.url || "",
            explicit: track.explicit,
            duration_ms: track.duration_ms
          };
        }
      });

      this.playingStateSubscription = this.spotifyService.playingState$.subscribe(isPlaying => {
        this.playing = isPlaying;
        this.updatePlayPauseIcon();
      });

      this.progressSubscription = this.spotifyService.playbackProgress$.subscribe(progress => {
        this.trackProgress = progress;
      });

      this.progressUpdateSubscription = interval(1000).subscribe(() => {
        this.spotifyService.getCurrentPlaybackState();
      });
    }

    // Subscribe to YouTube events only after ensuring YouTube is initialized
    else if (providerName === "youtube") {
      this.youtubeService.currentlyPlayingTrack$.subscribe(track => {
        if (track) {
          this.currentTrack = {
            name: track.name,
            artist: track.artist,
            imageUrl: track.imageUrl,
            explicit: false,
            duration_ms: track.duration_ms // You might want to adjust this depending on the YouTube API response
          };
        }
      });

      this.playingStateSubscription = this.youtubeService.playingState$.subscribe(isPlaying => {
        this.playing = isPlaying;
        this.updatePlayPauseIcon();
      });

      this.progressSubscription = this.youtubeService.playbackProgress$.subscribe(progress => {
        this.trackProgress = progress;
      });

      this.progressUpdateSubscription = interval(1000).subscribe(() => {
        this.youtubeService.getCurrentPlaybackState();
      });
    }
  }


  ngOnDestroy(): void
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.disconnectPlayer();
    }
    else
    {
      this.youtubeService.disconnectPlayer();
    }
    this.unsubscribeAll();
    this.providerService.clear();
  }

  private unsubscribeAll(): void
  {
    [this.trackSubscription, this.playingStateSubscription,
      this.progressSubscription, this.progressUpdateSubscription].forEach(sub =>
    {
      if (sub)
      {
        sub.unsubscribe();
      }
    });
  }

  async mute(): Promise<void>
  {
    this.muted = !this.muted;
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.spotifyService.mute();
    }
    else
    {
      await this.youtubeService.mute();
    }
  }

  async unmute(): Promise<void>
  {
    this.muted = false;
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.spotifyService.unmute();
    }
    else
    {
      await this.youtubeService.unmute();
    }
  }


  updateProgress(event: MouseEvent): void
  {
    if (!this.progressContainer)
    {
      console.error("Progress container not initialized");
      return;
    }

    const progressContainer = this.progressContainer.nativeElement;
    const clickX = event.clientX - progressContainer.getBoundingClientRect().left;
    const containerWidth = progressContainer.offsetWidth;
    const newProgress = (clickX / containerWidth) * 100;

    this.trackProgress = newProgress;
    this.cdr.detectChanges();

    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.seekToPosition(newProgress);
    }
    else
    {
      this.youtubeService.seekToPosition(newProgress);
    }
  }

  playMusic(): void
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.play();
    }
    else
    {
      this.youtubeService.play();
    }
  }

  pauseMusic(): void
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.pause();
    }
    else
    {
      this.youtubeService.pause();
    }
  }

  play()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      if (!this.started && !this.playing)
      {
        this.spotifyService.playTrackById("5mVfq3wn79JVdHQ7ZuLSCB");
        this.started = true;
        this.playing = true;
        this.updatePlayPauseIcon();
      }
      else
      {
        if (this.playing)
        {
          if (!this.started)
            this.started = true;
          this.pauseMusic();
          this.playing = false;
          this.updatePlayPauseIcon();
        }
        else
        {
          this.playMusic();
          this.playing = true;
          this.updatePlayPauseIcon();
        }
      }
    }
    else
    {
      if (!this.started && !this.playing)
      {
        this.youtubeService.playTrackById("5mVfq3wn79JVdHQ7ZuLSCB");
        this.started = true;
        this.playing = true;
        this.updatePlayPauseIcon();
      }
      else
      {
        if (this.playing)
        {
          if (!this.started)
            this.started = true;
          this.pauseMusic();
          this.playing = false;
          this.updatePlayPauseIcon();
        }
        else
        {
          this.playMusic();
          this.playing = true;
          this.updatePlayPauseIcon();
        }
      }
    }
  }

  playNext()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.playNextTrack();
    }
    else
    {
      this.youtubeService.nextTrack();
    }
  }

  playPrevious()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.playPreviousTrack();
    }
    else
    {
      this.youtubeService.previousTrack();
    }
  }

  onVolumeChange(event: any): void
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      const volume = event.target.value / 100;
      this.spotifyService.setVolume(volume);
    }
    else
    {
      const volume = event.target.value;
      this.youtubeService.setVolume(volume);
    }
  }

  private updatePlayPauseIcon(): void
  {
    if (this.playing)
    {
      this.imgsrc = "../../../assets/images/pause.png";
    }
    else
    {
      this.imgsrc = "../../../assets/images/play.png";
    }
  }

  playingNow(): boolean
  {
    return this.playing;
  }

  pausedNow(): boolean
  {
    return !(this.playing);
  }


  formatTime(seconds: number): string
  {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

}
