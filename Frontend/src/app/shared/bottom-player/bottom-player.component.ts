import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { SpotifyService } from "../../services/spotify.service";

@Component({
    selector: 'app-bottom-player',
    standalone: true,
    imports: [MatCard, MatCardContent, NgIf],
    templateUrl: './bottom-player.component.html',
    styleUrl: './bottom-player.component.css',
})
export class BottomPlayerComponent {
  protected imgsrc: string = '../../../assets/images/play.png';
  playing: boolean = false;
  started: boolean = false;
    constructor(protected themeService: ThemeService, private spotifyService: SpotifyService) {}

  ngOnDestroy(): void {
    this.spotifyService.disconnectPlayer();
  }

  playMusic(): void {
    this.spotifyService.play();
  }

  pauseMusic(): void {
    this.spotifyService.pause();
  }

  play() {
      if (!this.started) {
      this.spotifyService.playTrack();
      this.started = true;
      this.playing = true;
      this.imgsrc = '../../../assets/images/pause.png';
    }
    else {
        if (this.playing) {
          this.pauseMusic();
          this.playing = false;
          this.imgsrc = '../../../assets/images/play.png';
        } else {
          this.playMusic();
          this.playing = true;
          this.imgsrc = '../../../assets/images/pause.png';
        }
      }

  }

  onVolumeChange(event: any): void {
    const volume = event.target.value / 100;
    this.spotifyService.setVolume(volume);
  }
}


