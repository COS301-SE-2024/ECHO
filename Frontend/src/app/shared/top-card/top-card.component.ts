import { Component,Input } from '@angular/core';
import { MoodService } from '../../services/mood-service.service';
@Component({
  selector: 'app-top-card',
  standalone: true,
  imports: [],
  templateUrl: './top-card.component.html',
  styleUrl: './top-card.component.css'
})
export class TopCardComponent {
  @Input() imageUrl!: string;
  @Input() text!: string;
  @Input() secondaryText!: string;
  //Mood Service Variables
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };
  constructor(public moodService: MoodService) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
  }
}
