import { Component, Input } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-view',
  standalone: true,
  templateUrl: './album-view.component.html',
  styleUrl: './album-view.component.css',
  imports: [CommonModule]
})
export class AlbumViewComponent {
  @Input() selectedAlbum: any;

  constructor(public dialogRef: MatDialogRef<AlbumViewComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
