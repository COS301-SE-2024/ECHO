import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from "../../../services/provider.service";
import { SearchService } from "../../../services/search.service";
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
  echoTracks: any[] = [];
  isEchoModalVisible: boolean = false;

constructor(
  private providerService: ProviderService , 
  private searchService: SearchService  ,
  private spotifyService: SpotifyService
) {}
  async playTrack(trackId: string): Promise<void>
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.spotifyService.playTrackById(trackId);
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
}
