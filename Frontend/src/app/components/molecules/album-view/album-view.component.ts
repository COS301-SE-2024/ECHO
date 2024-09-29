import { Component, Input } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'album-song-view',
  standalone: true,
  templateUrl: './album-view.component.html',
  styleUrls: ['./album-view.component.css'],
  imports: [CommonModule]
})
export class SongViewComponent {
  @Input() selectedAlbum: any = {
    title: 'After Hours',
    image: '../assets/images/blinding-lights.png',
    artist: 'The Weeknd',
    album: 'After Hours',
    genre: 'Synthwave/Pop',
    mood: 'Sad',
    tracks: [
      { title: 'Blinding Lights', duration: '3:20' },
      { title: 'Save Your Tears', duration: '3:35' },
      { title: 'Heartless', duration: '3:18' },
      { title: 'In Your Eyes', duration: '3:57' },
      { title: 'Scared to Live', duration: '3:11' },
      { title: 'Alone Again', duration: '4:10' },
      { title: 'Too Late', duration: '3:40' }
    ]
  };

  constructor(public dialogRef: MatDialogRef<SongViewComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
