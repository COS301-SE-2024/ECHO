import { Component } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
@Component({
  selector: 'app-echo-logo',
  standalone: true,
  imports: [],
  templateUrl: './echo-log.component.html',
  styleUrl: './echo-log.component.css'
})
export class EchoLogComponent {
constructor(public moodService: MoodService) { }
getFillColor(): string {
  return this.moodService.getRBGAColor(this.moodService.getCurrentMood());
}
}
