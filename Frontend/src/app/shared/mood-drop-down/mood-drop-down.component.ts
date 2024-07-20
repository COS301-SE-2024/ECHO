import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { MoodService } from './../../services/mood-service.service';

@Component({
  selector: 'app-mood-drop-down',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './mood-drop-down.component.html',
  styleUrl: './mood-drop-down.component.css'
})
export class MoodDropDownComponent {
  currentMood!: string;
  moodClasses!:{ [key: string]: string };
  constructor(public moodService: MoodService) {
    this.currentMood = this.moodService.getCurrentMood(); // Ensure this method returns a valid string, even a default value
    this.moodClasses = this.moodService.getMoodClasses(); // Ensure this method returns a valid object
  }
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
    this.setMood(mood);
    this.toggleDropdown();
  }
  setMood(mood: string) {
    this.moodService.setCurrentMood(mood);
  }
  getMood() {
    return this.moodService.getCurrentMood();
  }
}