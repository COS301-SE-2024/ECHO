import { Component } from '@angular/core';
import {MoodListComponent} from '../../molecules/mood-list/mood-list.component';
import { SearchBarComponent } from '../../molecules/search-bar/search-bar.component';


@Component({
  selector: 'app-explore-bar',
  standalone: true,
  imports: [MoodListComponent,SearchBarComponent],
  templateUrl: './explore-bar.component.html',
  styleUrl: './explore-bar.component.css'
})
export class ExploreBarComponent {
  moods = [
    'All', 'Sad', 'Relaxed', 'Energetic',
    'Focused', 'Calm', 'Excited', 'Chill',
    'Melancholic', 'Motivated', 'Joy', 'Admiration', 'Love'
  ];
}
