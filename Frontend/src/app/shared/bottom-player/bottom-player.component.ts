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
    constructor(protected themeService: ThemeService, private spotifyService: SpotifyService) {}

  playMusic(): void {
    this.spotifyService.playTrack();  // This will play "Shape of You"
  }

  pauseMusic(): void {
    this.spotifyService.pause();
  }
}
