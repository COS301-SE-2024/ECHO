import { Component } from '@angular/core';
import { MoodService } from '../../../../../services/mood-service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-audio',
  standalone: true,
  imports: [NgClass],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.css'
})
export class AudioComponent {
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
