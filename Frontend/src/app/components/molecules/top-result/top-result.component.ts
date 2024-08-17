// In top-result.component.ts
import { Component, Input } from '@angular/core';
import {MoodService} from '../../../services/mood-service.service';
import { NgClass } from '@angular/common';  
@Component({
  selector: 'app-top-result',
  standalone: true,
  imports: [NgClass],
  templateUrl: './top-result.component.html',
  styleUrls: ['./top-result.component.css']
})
export class TopResultComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() imageSrc: string = '';
    //Mood Service Variables
    moodComponentClasses!:{ [key: string]: string };
    backgroundMoodClasses!:{ [key: string]: string };
    constructor(  public moodService: MoodService ) {
      this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
      this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }
}