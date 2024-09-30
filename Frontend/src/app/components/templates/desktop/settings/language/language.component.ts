import { Component } from '@angular/core';
import { MoodService } from '../../../../../services/mood-service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [NgClass],
  templateUrl: './language.component.html',
  styleUrl: './language.component.css'
})
export class LanguageComponent {
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
