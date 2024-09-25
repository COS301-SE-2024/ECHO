import { Component, OnInit } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';

@Component({
  selector: 'app-background-animation',
  standalone: true,
  imports: [],
  templateUrl: './background-animation.component.html',
  styleUrls: ['./background-animation.component.css']
})
export class BackgroundAnimationComponent {
  backgroundMoodColorClasses!: { [key: string]: string };

  constructor(public moodService: MoodService) {
    this.backgroundMoodColorClasses = moodService.getMoodColors();
  }

}