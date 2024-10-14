import { Component, Input } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import { MoodService } from '../../../services/mood-service.service';
import { YouTubeService } from "../../../services/youtube.service";
import { ProviderService } from "../../../services/provider.service";
import { SpotifyService } from "../../../services/spotify.service";
import { PlayIconComponent } from '../../organisms/play-icon/play-icon.component';

@Component({
  selector: 'app-song-view',
  standalone: true,
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.css'],
  imports: [CommonModule, PlayIconComponent]
})
export class SongViewComponent {
  @Input() selectedSong: any = {
    title: 'Blinding Lights',
    image: './assets/images/blinding-lights.png',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    genre: 'Synthwave/Pop',
    mood: 'Energetic',
    similarSongs: [
      'Save Your Tears - The Weeknd',
      'Take On Me - a-ha',
      'Can’t Feel My Face - The Weeknd',
      'Shut Up and Dance - WALK THE MOON'
    ]
  };

  @Input() card: any;
  isExpanded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SongViewComponent>, 
    public moodService: MoodService,
    private providerService: ProviderService,
    private spotifyService: SpotifyService,
    private youtubeService: YouTubeService,
  ) {}

  async playTrack(trackId: string): Promise<void>
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.spotifyService.playTrackById(trackId);
    }
    else
    {
      await this.youtubeService.playTrackById(trackId);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  toggleSimilarSongs() {
    this.isExpanded = !this.isExpanded;
  }
}
