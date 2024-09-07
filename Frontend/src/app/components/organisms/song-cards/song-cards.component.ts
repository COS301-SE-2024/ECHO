import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from "../../../services/provider.service";
import { SpotifyService } from "../../../services/spotify.service";
import { SvgIconComponent } from '../../atoms/svg-icon/svg-icon.component';
import { EchoButtonComponent } from '../../atoms/echo-button/echo-button.component';
import { Router } from '@angular/router';
import { MoodService } from '../../../services/mood-service.service';
import { YouTubeService } from "../../../services/youtube.service";

@Component({
  selector: 'app-song-cards',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, EchoButtonComponent],
  templateUrl: './song-cards.component.html',
  styleUrls: ['./song-cards.component.css']
})
export class SongCardsComponent {
  @Input() card: any;
  @Input() imgSize: string = '100px'; // Default image size
  @Input() svgSize: string = '100px'; // Default image size
  @Output() echoTrackEvent = new EventEmitter<{ trackName: string, artistName: string, event: MouseEvent }>();
  moodComponentClasses!: { [key: string]: string };
  echoTracks: any[] = [];
  isEchoModalVisible: boolean = false;

  constructor(
    private providerService: ProviderService,
    private spotifyService: SpotifyService,
    private youtubeService: YouTubeService,
    private router: Router,
    public moodService: MoodService
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    
  }

  onEchoButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/echo Song'], { queryParams: { trackName: this.card.text, artistName: this.card.secondaryText } });
  }
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
}