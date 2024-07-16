// song-view.component.ts
import { Component, Input } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-view',
  standalone: true,
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.css'],
  imports: [CommonModule]
})
export class SongViewComponent {
  @Input() selectedSong: any;

  constructor(public dialogRef: MatDialogRef<SongViewComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
