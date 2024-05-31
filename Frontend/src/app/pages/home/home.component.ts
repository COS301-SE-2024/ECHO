import { Component } from '@angular/core';
import {SongRecommendationComponent} from "../../shared/song-recommendation/song-recommendation.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SongRecommendationComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
