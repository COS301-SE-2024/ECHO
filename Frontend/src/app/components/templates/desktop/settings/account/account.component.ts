import { Component } from '@angular/core';
import { MoodService } from '../../../../../services/mood-service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NgClass],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  constructor(
    public moodService: MoodService,
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
  }
}
