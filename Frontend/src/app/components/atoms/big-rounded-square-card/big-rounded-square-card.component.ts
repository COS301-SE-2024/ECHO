import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-big-rounded-square-card',
  standalone: true,
  imports: [],
  templateUrl: './big-rounded-square-card.component.html',
  styleUrls: ['./big-rounded-square-card.component.css']
})
export class BigRoundedSquareCardComponent {
  @Input() mood: any;
  @Output() moodClick = new EventEmitter<any>();

  onMoodClick() {
    this.moodClick.emit(this.mood);
  }
}