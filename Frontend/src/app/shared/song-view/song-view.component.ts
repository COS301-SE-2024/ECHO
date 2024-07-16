// song-view.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.css']
})
export class SongViewComponent {
  @Input() selectedSong: any;
  isModalOpen: boolean = false;

  closeModal() {
    this.isModalOpen = false;
  }
}
