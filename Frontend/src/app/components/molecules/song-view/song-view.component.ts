import { Component, Input } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { CommonModule, NgClass } from '@angular/common';
import { MoodComponent } from '../../../pages/mood/mood.component';
import { MoodService } from '../../../services/mood-service.service';

@Component({
  selector: 'app-song-view',
  standalone: true,
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.css'],
  imports: [CommonModule, NgClass, MoodComponent]
})
export class SongViewComponent {
  @Input() selectedSong: any;
  
  // Mood Service Variables
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  underline!: { [key: string]: string };

  constructor(
    public dialogRef: MatDialogRef<SongViewComponent>,
    public moodService: MoodService,
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    this.underline = this.moodService.getUnerlineMoodClasses();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
