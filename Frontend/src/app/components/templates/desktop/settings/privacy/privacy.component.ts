import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { MoodService } from '../../../../../services/mood-service.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [NgClass],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  constructor(
    public moodService: MoodService,
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
  }
}
