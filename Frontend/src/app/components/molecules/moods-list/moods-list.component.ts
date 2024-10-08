// moods-list.component.ts
import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigRoundedSquareCardComponent } from '../../atoms/big-rounded-square-card/big-rounded-square-card.component';
import { PlayIconComponent } from '../../organisms/play-icon/play-icon.component';
import { MoodService } from '../../../services/mood-service.service';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-moods-list',
  standalone: true,
  imports: [CommonModule,BigRoundedSquareCardComponent,PlayIconComponent],
  templateUrl: './moods-list.component.html',
  styleUrls: ['./moods-list.component.css']
})
export class MoodsListComponent implements OnInit {
  @Input() moods!: any[];
  @Input() width: string = '10vh';
  @Output() redirectToMoodPage = new EventEmitter<any>();
  isDropdownOpen = false;

  constructor(public moodService: MoodService) {}

  onMoodClick(mood: any) {
    this.redirectToMoodPage.emit(mood);
  }

  ngOnInit(): void {
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
