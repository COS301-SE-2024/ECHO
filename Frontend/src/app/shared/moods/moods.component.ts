// moods.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SongViewComponent } from '../song-view/song-view.component';
import { ScreenSizeService } from '../../services/screen-size-service.service';

@Component({
  selector: 'app-moods',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, CommonModule, MatDialogModule],
  templateUrl: './moods.component.html',
  styleUrl: './moods.component.css',
})
export class MoodsComponent {
  screenSize?: string;

  constructor(
    private screenSizeService: ScreenSizeService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }

  favouriteMoods = [
    { name: 'Anxious', image: '/assets/moods/arctic.jpeg' },
    { name: 'Chill', image: '/assets/moods/kendrick.jpeg' },
    { name: 'Happy', image: '/assets/moods/gambino.jpeg' },
    { name: 'Melancholy', image: '/assets/moods/radiohead.jpeg' },
    { name: 'Nostalgic', image: '/assets/moods/sza.jpeg' },
    { name: 'Unknown', image: '/assets/moods/img6.jpg' },
  ];

  RecommendedMoods = [
    { name: 'Mad', image: '/assets/moods/yonce.jpeg' },
    { name: 'Nostalgic', image: '/assets/moods/taylor.jpeg' },
    { name: 'Ethereal', image: '/assets/moods/impala.jpeg' },
    { name: 'Confident', image: '/assets/moods/tyler.jpeg' },
    { name: 'Happy', image: '/assets/moods/beatles.jpeg' },
    { name: 'Introspective', image: '/assets/moods/happy.jpg' },
  ];

  openModal(mood: any): void {
    const dialogRef = this.dialog.open(SongViewComponent, {
      width: '500px'
    });

    dialogRef.componentInstance.selectedSong = {
      image: mood.image,
      title: mood.name,
      artist: 'Artist Name', 
      album: 'Album Name', 
      duration: 'Duration', 
      genre: 'Genre', 
      similarSongs: ['Song 1', 'Song 2', 'Song 3'] 
    };

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

