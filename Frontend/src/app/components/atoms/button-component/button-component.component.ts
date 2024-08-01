//angular imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodService } from '../../../services/mood-service.service';
@Component({
  selector: 'app-button-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-component.component.html',
  styleUrls: ['./button-component.component.css']
})
export class ButtonComponentComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Output() click = new EventEmitter<Event>();
  moodComponentClasses!: { [key: string]: string };

  constructor(
    public moodService: MoodService
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClassesHover(); 
  }

  handleClick(event: Event): void {
    this.click.emit(event);
  }
}