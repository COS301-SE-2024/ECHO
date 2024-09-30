//angular imports
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
//services
import { MoodService } from '../../../services/mood-service.service';
@Component({
  selector: 'app-input-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-component.component.html',
  styleUrl: './input-component.component.css'
})
export class InputComponentComponent {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  moodComponentClasses!: { [key: string]: string };

  constructor(
    public moodService: MoodService
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClassesDark(); 
  }
}