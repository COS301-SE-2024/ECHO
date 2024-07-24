import { Component, Input } from '@angular/core';
import { MoodService } from '../../services/mood-service.service';

@Component({
  selector: 'app-echo-button',
  standalone: true,
  templateUrl: './echo-button.component.html',
  styleUrls: ['./echo-button.component.css']
})
export class EchoButtonComponent {
  @Input() color: string = '#EE0258';
  @Input() width: number = 29;
  @Input() height: number = 28;

   // Mood Service Variables
   moodComponentClasses!: { [key: string]: string };
   backgroundMoodClasses!: { [key: string]: string };
   constructor(    public moodService: MoodService
    ) {
      this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
      this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    } 

}
