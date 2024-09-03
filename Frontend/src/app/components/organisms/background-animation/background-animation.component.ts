import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-animation',
  standalone: true,
  imports: [],
  templateUrl: './background-animation.component.html',
  styleUrls: ['./background-animation.component.css']
})
export class BackgroundAnimationComponent implements OnInit {
  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      const blobs = document.querySelectorAll('.blob');

      function changeBlobColor(color: string) {
        blobs.forEach((blob) => {
          (blob as HTMLElement).style.backgroundColor = color;
        });
      }

      // Initial color
      changeBlobColor('#FF6B6B');

      // Tween to a new color after 8 seconds
      setTimeout(() => {
        changeBlobColor('#6A0572');
      }, 8000);

      // Optional: Further tween to another color after 16 seconds
      setTimeout(() => {
        changeBlobColor('#FEB692');
      }, 16000);
    }
  }
}