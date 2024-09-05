import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from "../../../services/provider.service";
import { SpotifyService } from "../../../services/spotify.service";
import { SvgIconComponent } from '../../atoms/svg-icon/svg-icon.component';
import { EchoButtonComponent } from '../../atoms/echo-button/echo-button.component';
import { Router } from '@angular/router';

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
  @Output() echoTrackEvent = new EventEmitter<{ trackName: string, artistName: string, event: MouseEvent }>();

  echoTracks: any[] = [];
  isEchoModalVisible: boolean = false;

  constructor(
    private providerService: ProviderService,
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  onEchoButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/echo Song'], { queryParams: { trackName: this.card.text, artistName: this.card.secondaryText } });
  }

  async playTrack(trackId: string): Promise<void> {
    if (this.providerService.getProviderName() === "spotify") {
      await this.spotifyService.playTrackById(trackId);
    }
  }
}