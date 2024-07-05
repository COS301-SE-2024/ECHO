import { Component, AfterViewInit, OnDestroy } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { NgIf } from "@angular/common";
import { ThemeService } from "../../services/theme.service";
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { Subscription, interval } from "rxjs";

@Component({
  selector: "app-bottom-player",
  standalone: true,
  imports: [MatCard, MatCardContent, NgIf],
  templateUrl: "./bottom-player.component.html",
  styleUrls: ["./bottom-player.component.css"]
})
export class BottomPlayerComponent implements AfterViewInit, OnDestroy {
  protected imgsrc: string = "../../../assets/images/play.png";
  playing: boolean = false;
  started: boolean = false;
  screenSize?: string;

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

  constructor(protected themeService: ThemeService, private spotifyService: SpotifyService,private screenSizeService: ScreenSizeService) {
  }


  ngAfterViewInit(): void {
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
  
  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
    if (typeof window !== 'undefined') {
      await this.spotifyService.init();
    }
  }
  
  ngOnDestroy(): void {
    this.spotifyService.disconnectPlayer();
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
    if (this.playingStateSubscription) {
      this.playingStateSubscription.unsubscribe();
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
    if (this.progressUpdateSubscription) {
      this.progressUpdateSubscription.unsubscribe();
    }
  }

  playMusic(): void {
    this.spotifyService.play();
  }

  pauseMusic(): void {
    this.spotifyService.pause();
  }

  play() {
    if (!this.started && !this.playing) {
      this.spotifyService.playTrackById("5mVfq3wn79JVdHQ7ZuLSCB");
      this.started = true;
      this.playing = true;
      this.updatePlayPauseIcon();
    } else {
      if (this.playing) {
        if (!this.started)
          this.started = true;
        this.pauseMusic();
        this.playing = false;
        this.updatePlayPauseIcon();
      } else {
        this.playMusic();
        this.playing = true;
        this.updatePlayPauseIcon();
      }
    }
  }

  onVolumeChange(event: any): void {
    const volume = event.target.value / 100;
    this.spotifyService.setVolume(volume);
  }

  private updatePlayPauseIcon(): void {
    if (this.playing) {
      this.imgsrc = this.themeService.isDarkModeActive()
        ? "../../../assets/images/pause-dark.png"
        : "../../../assets/images/pause.png";
    } else {
      this.imgsrc = this.themeService.isDarkModeActive()
        ? "../../../assets/images/play-dark.png"
        : "../../../assets/images/play.png";
    }
  }

  playingNowDark(): boolean {
    return (this.playing && this.themeService.isDarkModeActive());
  }

  playingNow(): boolean {
    return (this.playing && (!this.themeService.isDarkModeActive()));
  }

  pausedNow(): boolean {
    return ((!this.playing) && (!this.themeService.isDarkModeActive()));
  }

  pausedNowDark(): boolean {
    return ((!this.playing) && (this.themeService.isDarkModeActive()));
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}
