// song-view.component.ts
import { Component, Input } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.css']
})
export class SongViewComponent {
  @Input() selectedSong: any;
  isModalOpen: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SongViewComponent>
  ) {
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
