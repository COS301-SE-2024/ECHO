// moods-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-moods-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moods-list.component.html',
  styleUrls: ['./moods-list.component.css']
})
export class MoodsListComponent {
  @Input() title?: string;
  @Input() moods?: any[];
  @Output() redirectToMoodPage = new EventEmitter<any>();

  onMoodClick(mood: any) {
    this.redirectToMoodPage.emit(mood);
  }
  
}