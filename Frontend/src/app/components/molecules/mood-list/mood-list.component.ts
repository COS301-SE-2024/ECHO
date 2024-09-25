import { Component, Input } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { CommonModule } from '@angular/common';
import { ButtonComponentComponent } from './../../atoms/button-component/button-component.component';

@Component({
  selector: 'app-mood-list',
  standalone: true,
  imports: [ButtonComponentComponent,CommonModule],
  templateUrl: './mood-list.component.html',
  styleUrls: ['./mood-list.component.css']
})
export class MoodListComponent {
  @Input() moods!: string[];
  @Input() selectedMood = 0;
  @Input() screenSize!: string;
  
  constructor(public moodService: MoodService) {
    
  }
  selectMood(index: number) {
    this.selectedMood = index;
  }
}
