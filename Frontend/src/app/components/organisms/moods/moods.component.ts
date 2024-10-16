import { Component, OnDestroy, OnInit,Input, Output, EventEmitter } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialog } from "@angular/material/dialog";
import { ScreenSizeService } from "../../../services/screen-size-service.service";
import { MoodService } from "../../../services/mood-service.service";
import { PageTitleComponent } from "../../atoms/page-title/page-title.component";
import { MoodsListComponent } from "../../molecules/moods-list/moods-list.component";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { SearchService, Track } from "../../../services/search.service";
import {MoodListComponent} from '../../molecules/mood-list/mood-list.component';

@Component({
  selector: "app-moods",
  standalone: true,
  imports: [MatGridListModule, MatCardModule, CommonModule, MoodsListComponent, PageTitleComponent,MoodListComponent],
  templateUrl: "./moods.component.html",
  styleUrls: ["./moods.component.css"]
})
export class MoodsComponent implements OnInit, OnDestroy {
  favouriteMoods: any[] = [];
  RecommendedMoods: any[] = [];
  allMoods!: string[];
  screenSize?: string;
  selectedMood: string = '';

  moodComponentClasses!: { [key: string]: string };
  private screenSizeSubscription?: Subscription;
  @Input() width: string = "10vh";
  moods = [
    'All', 'Joy', 'Surprise', 'Sadness',
    'Anger', 'Disgust', 'Contempt', 'Shame',
    'Fear', 'Guilt', 'Excitement', 'Love'
  ];

  constructor(
    private screenSizeService: ScreenSizeService,
    public moodService: MoodService,
    private dialog: MatDialog,
    private router: Router,
    private searchService: SearchService
  ) {
    this.allMoods = this.moodService.getAllMoods();
    this.moodComponentClasses = this.moodService.getUnerlineMoodClasses();
  }

  async ngOnInit() {
    this.screenSizeSubscription = this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });

    this.loadMoods();
    this.loadRecommendedMoods();
  }

  ngOnDestroy() {
    this.screenSizeSubscription?.unsubscribe();
  }
  onMoodSelected(mood: string) {
    if (mood === 'All') {
      this.selectedMood = '';
      return;
    }
    this.selectedMood = mood;
  }
  loadMoods(): void {
    const moodNames = [
      "Neutral", "Anger", "Fear", "Joy", "Disgust",
      "Excitement", "Love", "Sadness", "Surprise",
      "Contempt", "Shame", "Guilt"
    ];

    moodNames.forEach(moodName => {
      this.searchService.getSongsByMood(moodName).subscribe(
        (response: { imageUrl: string, tracks: Track[] }) => {
          const moodWithTracks = {
            name: moodName,
            tracks: response.tracks,
            image: response.imageUrl || "/assets/default-image.jpg"
          };
          this.favouriteMoods.push(moodWithTracks);
        },
        error => {
          console.error(`Failed to load tracks for mood ${moodName}:`, error);
        }
      );
    });
  }

  loadRecommendedMoods(): void {
    this.searchService.getSuggestedMoods().subscribe(
      (moodPlaylists: { mood: string, imageUrl: string, tracks: Track[] }[]) => {
        moodPlaylists.forEach(moodPlaylist => {
          const moodWithTracks = {
            name: moodPlaylist.mood,
            tracks: moodPlaylist.tracks,
            image: moodPlaylist.imageUrl || "/assets/default-image.jpg"
          };
          this.RecommendedMoods.push(moodWithTracks);
        });
      },
      (error: any) => {
        console.error("Failed to load recommended moods:", error);
      }
    );
  }

  redirectToMoodPage(mood: any): void {
    this.router.navigate(["/mood"], { queryParams: { title: mood.name } });
  }
}