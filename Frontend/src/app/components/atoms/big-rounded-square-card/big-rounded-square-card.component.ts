import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageTitleComponent } from '../../atoms/page-title/page-title.component';
import { MoodService } from '../../../services/mood-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-big-rounded-square-card',
  standalone: true,
  imports: [PageTitleComponent,CommonModule],
  templateUrl: './big-rounded-square-card.component.html',
  styleUrls: ['./big-rounded-square-card.component.css']
})
export class BigRoundedSquareCardComponent {
  @Input() mood: any;
  @Output() redirectToMoodPage = new EventEmitter<any>();
  moodComponentClasses!: { [key: string]: string };
  isDropdownOpen = false;

  constructor(public moodService: MoodService) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();

  }

  onMoodClick() {
    this.redirectToMoodPage.emit(this.mood);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}