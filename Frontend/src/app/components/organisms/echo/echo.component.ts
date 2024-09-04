import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongCardsComponent } from "../song-cards/song-cards.component";
import { SearchService } from "../../../services/search.service";

@Component({
  selector: 'app-echo',
  standalone: true,
  imports: [CommonModule,SongCardsComponent],
  templateUrl: './echo.component.html',
  styleUrl: './echo.component.css'
})
export class EchoComponent {
  constructor(private searchService: SearchService) { }
  echoTracks: any[] = [];

  async echoTrack(trackName: string, artistName: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      this.echoTracks = await this.searchService.echo(trackName, artistName);
    } catch (error) {
      console.error("Error echoing track: ", error);
      // this.toastComponent.showToast("Error echoing track", "error"); // Show error toast
    }
  }
}