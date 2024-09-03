import { Component, Input,EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from "../../../services/provider.service";
import { SpotifyService } from "../../../services/spotify.service";

@Component({
  selector: 'app-song-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-cards.component.html',
  styleUrl: './song-cards.component.css'
})
export class SongCardsComponent {
  @Input() card: any;
  @Output() echoTrackEvent = new EventEmitter<{ trackName: string, artistName: string, event: MouseEvent }>();

  echoTracks: any[] = [];
  isEchoModalVisible: boolean = false;

constructor(
  private providerService: ProviderService ,
  private spotifyService: SpotifyService) {}

  onEchoButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.echoTrackEvent.emit({ trackName: this.card.text, artistName: this.card.secondaryText, event });
  }
  async playTrack(trackId: string): Promise<void>
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.spotifyService.playTrackById(trackId);
    }
  }


}
