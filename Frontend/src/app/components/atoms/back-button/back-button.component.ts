import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-back-button',
  standalone: true,
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css'],
  imports: [ NgClass ],
})
export class BackButtonComponent {
  @Input() buttonClasses: string = '';
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  constructor(
    private location: Location,
    public moodService: MoodService,
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
  }


  goBack() {
    this.location.back();
  }
}
