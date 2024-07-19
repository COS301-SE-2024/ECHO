import { Component } from '@angular/core';
import { NgIf ,NgFor} from '@angular/common';
@Component({
  selector: 'app-mood-drop-down',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './mood-drop-down.component.html',
  styleUrl: './mood-drop-down.component.css'
})
export class MoodDropDownComponent {
  dropdownOpen = false;
  moods: string[] = [
    'Admiration',
    'Amusement',
    'Anger',
    'Annoyance',
    'Approval',
    'Caring',
    'Confusion',
    'Curiosity',
    'Desire',
    'Disappointment',
    'Disapproval',
    'Disgust',
    'Embarrassment',
    'Excitement',
    'Fear',
    'Gratitude',
    'Grief',
    'Joy',
    'Love',
    'Nervousness',
    'Optimism',
    'Pride',
    'Realisation',
    'Relief',
    'Remorse',
    'Sadness',
    'Surprise',
    'Neutral'
  ];
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  selectMood(mood: string) {
    console.log(mood);
  }
}
