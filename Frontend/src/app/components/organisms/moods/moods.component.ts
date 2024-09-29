import { Component, OnDestroy, OnInit } from "@angular/core";
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

@Component({
  selector: "app-moods",
  standalone: true,
  imports: [MatGridListModule, MatCardModule, CommonModule, MoodsListComponent, PageTitleComponent],
  templateUrl: "./moods.component.html",
  styleUrls: ["./moods.component.css"]
})
export class MoodsComponent implements OnInit, OnDestroy {
  favouriteMoods: any[] = [];
  RecommendedMoods: any[] = [];
  allMoods!: string[];
  screenSize?: string;
  moodComponentClasses!: { [key: string]: string };
  private screenSizeSubscription?: Subscription;

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

  // openModal(mood: any): void {
  //   const dialogRef = this.dialog.open(SongViewComponent, {
  //     width: '500px'
  //   });

  //   dialogRef.componentInstance.selectedSong = {
  //     image: mood.image,
  //     title: mood.name,
  //     artist: 'Artist Name',
  //     album: 'Album Name',
  //     duration: 'Duration',
  //     genre: 'Genre',
  //     similarSongs: ['Song 1', 'Song 2', 'Song 3']
  //   };

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
}