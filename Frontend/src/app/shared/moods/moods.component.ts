import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SongViewComponent } from '../song-view/song-view.component';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from '../../services/mood-service.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-moods',
    standalone: true,
    imports: [MatGridListModule, MatCardModule, NgClass, NgForOf, NgIf],
    templateUrl: './moods.component.html',
    styleUrls: ['./moods.component.css'], // Corrected property name and expected value type
})
export class MoodsComponent implements OnDestroy {
    
    favouriteMoods: any[] = []; // Corrected initialization
    RecommendedMoods: any[] = []; // Added type and initialization

    allMoods!: string[];
    screenSize?: string;
    // Mood Service Variables
    moodComponentClasses!: { [key: string]: string };
    backgroundMoodClasses!: { [key: string]: string };

    private screenSizeSubscription?: Subscription; // For unsubscribing

    constructor(private screenSizeService: ScreenSizeService, public moodService: MoodService,private Dailog: MatDialog) {
        this.allMoods = this.moodService.getAllMoods();
        this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
        this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }
    async ngOnInit() {
        this.screenSizeSubscription = this.screenSizeService.screenSize$.subscribe(screenSize => {
            this.screenSize = screenSize;
        });

        const allMoodNames = this.allMoods;
        const defaultImagePaths = [
            '/assets/moods/arctic.jpeg',
            '/assets/moods/kendrick.jpeg',
            '/assets/moods/gambino.jpeg',
            '/assets/moods/yonce.jpeg',
            '/assets/moods/taylor.jpeg',
            '/assets/moods/impala.jpeg',
        ];
    
        allMoodNames.forEach((moodName, index) => {
            const moodWithDefaultImage = {
                name: moodName,
                image: defaultImagePaths[index % defaultImagePaths.length],
            };
            this.favouriteMoods.push(moodWithDefaultImage);
            this.RecommendedMoods.push(moodWithDefaultImage);
        });
    }

    ngOnDestroy() {
        this.screenSizeSubscription?.unsubscribe(); // Proper cleanup
    }
    openModal(mood: any): void {
      const dialogRef = this.dialog.open(SongViewComponent, {
        width: '500px'
      });
  
      dialogRef.componentInstance.selectedSong = {
        image: mood.image,
        title: mood.name,
        artist: 'Artist Name', 
        album: 'Album Name', 
        duration: 'Duration', 
        genre: 'Genre', 
        similarSongs: ['Song 1', 'Song 2', 'Song 3'] 
      };
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
}