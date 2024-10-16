import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { CommonModule } from '@angular/common';
import { ButtonComponentComponent } from './../../atoms/button-component/button-component.component';

@Component({
  selector: 'app-mood-list',
  standalone: true,
  imports: [ButtonComponentComponent, CommonModule],
  templateUrl: './mood-list.component.html',
  styleUrls: ['./mood-list.component.css']
})
export class MoodListComponent {
  @Input() moods!: string[];
  @Input() selectedMood = 0;
  @Input() screenSize!: string;
  @Output() moodSelected = new EventEmitter<string>();
  constructor(public moodService: MoodService) {}
  
  selectMood(index: number) {
    this.selectedMood = index;
    this.moodSelected.emit(this.moods[index]);
  }
}