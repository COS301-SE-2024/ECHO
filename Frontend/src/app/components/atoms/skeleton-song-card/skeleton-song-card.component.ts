import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-song-card',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-song-card.component.html',
  styleUrl: './skeleton-song-card.component.css'
})
export class SkeletonSongCardComponent {
  @Input() imageSize: string= '100px' // Define an input property
}