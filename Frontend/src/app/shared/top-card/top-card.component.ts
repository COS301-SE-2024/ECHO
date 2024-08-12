import { Component,Input } from '@angular/core';
import { MoodService } from '../../services/mood-service.service';
import { NgClass} from '@angular/common';
import { SongViewComponent } from '../song-view/song-view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-top-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './top-card.component.html',
  styleUrl: './top-card.component.css'
})

export class TopCardComponent {

  @Input() imageUrl!: string;
  @Input() text!: string;
  @Input() secondaryText!: string;
  //Mood Service Variables
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };
  MoodClassesDark!:{[key: string]: string};

  constructor(
    public moodService: MoodService,
    protected dialog: MatDialog,
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    this.MoodClassesDark = this.moodService.getComponentMoodClassesDark();
  }

  openModal(): void {
    const dialogRef = this.dialog.open(SongViewComponent, {
        
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
    });
  }
}
