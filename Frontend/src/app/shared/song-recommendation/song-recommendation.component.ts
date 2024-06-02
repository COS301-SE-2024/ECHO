import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-recommendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-recommendation.component.html',
  styleUrl: './song-recommendation.component.css',
})
export class SongRecommendationComponent {
  title = 'Personalized Song Recommendations';

  categories = ['Key', 'BPM', 'Theme', 'mood'];

  currentSong = {
    title: 'Song Title',
    imageUrl: 'https://placehold.co/50x50',
    bpm: 120,
    theme: 'Love',
    mood: 'Happy',
  };

  recommendedSongs = [
    {
      title: ' Title 1',
      imageUrl: 'https://placehold.co/50x50',
      bpm: 130,
      theme: 'Adventure',
      mood: 'Excited',
    },
    {
      title: ' Title 2',
      imageUrl: 'https://placehold.co/50x50',
      bpm: 110,
      theme: 'Relaxation',
      mood: 'Calm',
    },
    {
      title: ' Title 3',
      imageUrl: 'https://placehold.co/50x50',
      bpm: 140,
      theme: 'Workout',
      mood: 'Energetic',
    },
  ];
}
