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
  @Input() isSelected: boolean = false;
  @Output() click = new EventEmitter<Event>();
  moodComponentClassesDark!: { [key: string]: string };
  moodComponentClassesHover!: { [key: string]: string };

  constructor(public moodService: MoodService) {
    this.moodComponentClassesDark = this.moodService.getComponentMoodClassesDark();
    this.moodComponentClassesHover = this.moodService.getComponentMoodClassesHover();
  }

  handleClick(event: Event): void {
    this.click.emit(event);
  }
}