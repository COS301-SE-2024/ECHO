import { Component } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
@Component({
  selector: 'app-dolphin',
  standalone: true,
  imports: [],
  templateUrl: './dolphin.component.html',
  styleUrl: './dolphin.component.css'
})
export class DolphinComponent {
backgroundMoodColorClasses : { [key: string]: string };
constructor(public moodService: MoodService) {
  this.backgroundMoodColorClasses = moodService.getMoodColors();
}
}
