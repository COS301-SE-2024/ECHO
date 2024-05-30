import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-song-recommendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-recommendation.component.html',
  styleUrl: './song-recommendation.component.css'
})
export class SongRecommendationComponent {
  title = 'Personalized Song Recommendations';

 currentSong = {
  title: 'Song Title',
  imageUrl: 'https://placehold.co/50x50',
  bpm: 120,
  theme: 'Love',
  mood: 'Happy'
};

recommendedSongs = [
  { 
    title: 'Recommended Song Title 1', 
    imageUrl: 'https://placehold.co/50x50', 
    bpm: 130, 
    theme: 'Adventure', 
    mood: 'Excited' 
  },
  { 
    title: 'Recommended Song Title 2', 
    imageUrl: 'https://placehold.co/50x50', 
    bpm: 110, 
    theme: 'Relaxation', 
    mood: 'Calm' 
  },
  { 
    title: 'Recommended Song Title 3', 
    imageUrl: 'https://placehold.co/50x50', 
    bpm: 140, 
    theme: 'Workout', 
    mood: 'Energetic' 
  }
];
}
