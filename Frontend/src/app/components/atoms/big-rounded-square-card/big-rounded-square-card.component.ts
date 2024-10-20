import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageTitleComponent } from '../../atoms/page-title/page-title.component';
import { MoodService } from '../../../services/mood-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-big-rounded-square-card',
  standalone: true,
  imports: [PageTitleComponent, CommonModule],
  templateUrl: './big-rounded-square-card.component.html',
  styleUrls: ['./big-rounded-square-card.component.css']
})
export class BigRoundedSquareCardComponent {
  @Input() mood: any;
  @Output() moodClick = new EventEmitter<any>();
  moodComponentClasses!: { [key: string]: string };
  isDropdownOpen = false;
  isModalOpen = false;

  constructor(public moodService: MoodService) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
  }

  onMoodClick() {
    this.moodClick.emit(this.mood);
    this.openModal();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onMouseLeave(): void {
    this.isDropdownOpen = false;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
