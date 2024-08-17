import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { NgIf, NgClass } from '@angular/common';
import { MoodDropDownComponent } from '../../../organisms/mood-drop-down/mood-drop-down.component';
import { MoodService } from '../../../../services/mood-service.service';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [NgIf, NgClass, MoodDropDownComponent],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  constructor(
    protected themeService: ThemeService,
    public moodService: MoodService,
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
  }

  switchTheme(): void {
    this.themeService.switchTheme();
  }
}
