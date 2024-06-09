import { Component, AfterViewInit, OnDestroy } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { NgIf } from "@angular/common";
import { ThemeService } from "../../services/theme.service";
import { SpotifyService } from "../../services/spotify.service";
import { Subscription } from "rxjs";

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
  currentTrack: any = {
    name: "All In",
    artist: "Nasty C ft. TI",
    imageUrl: "../../../assets/images/nasty.jpg",
    explicit: true
  };
  private trackSubscription!: Subscription;
  private playingStateSubscription!: Subscription;

  constructor(protected themeService: ThemeService, private spotifyService: SpotifyService) {
  }

  ngAfterViewInit(): void {

    this.trackSubscription = this.spotifyService.currentlyPlayingTrack$.subscribe(track => {
      if (track) {
        this.currentTrack = {
          name: track.name,
          artist: track.artists.map((artist: any) => artist.name).join(", "),
          imageUrl: track.album.images[0]?.url || "",
          explicit: track.explicit
        };
      }
    });

    this.playingStateSubscription = this.spotifyService.playingState$.subscribe(isPlaying => {
      this.playing = isPlaying;
      this.updatePlayPauseIcon();
    });
  }

  ngOnDestroy(): void {
    this.spotifyService.disconnectPlayer();
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
    if (this.playingStateSubscription) {
      this.playingStateSubscription.unsubscribe();
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
}
