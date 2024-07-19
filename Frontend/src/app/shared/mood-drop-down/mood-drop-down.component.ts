import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { MoodService } from './../../services/mood-service.service';

@Component({
  selector: 'app-mood-drop-down',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  template: `
    <div class="dropdown relative w-full max-w-xs">
      <button [ngClass]="moodClasses[this.moodService.getCurrentMood()]" class="w-full text-white-300  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between" type="button" id="dropdownMenuButton1" (click)="toggleDropdown()" aria-expanded="false">
        {{ this.moodService.getCurrentMood() || 'Choose Mood' }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <ul *ngIf="dropdownOpen" class="dropdown-menu min-w-max absolute bg-white text-base z-50 left-0 right-0 py-2 list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none">
        <li *ngFor="let mood of moods">
          <a class="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 text-center" (click)="selectMood(mood)">{{ mood }}</a>
        </li>
      </ul>
    </div>
  `,
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