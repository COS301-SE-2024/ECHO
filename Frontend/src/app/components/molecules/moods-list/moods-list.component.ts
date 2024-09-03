// moods-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigRoundedSquareCardComponent } from '../../atoms/big-rounded-square-card/big-rounded-square-card.component';
@Component({
  selector: 'app-moods-list',
  standalone: true,
  imports: [CommonModule,BigRoundedSquareCardComponent],
  templateUrl: './moods-list.component.html',
  styleUrls: ['./moods-list.component.css']
})
export class MoodsListComponent {
  @Input() moods?: any[];
  @Output() redirectToMoodPage = new EventEmitter<any>();

  onMoodClick(mood: any) {
    this.redirectToMoodPage.emit(mood);
  }
  
}