import { Component, Input } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass } from '@angular/common';
import { SongViewComponent } from '../../../components/molecules/song-view/song-view.component';
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
  @Input() text!: string; // trackName
  @Input() secondaryText!: string; // artistName

  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  MoodClassesDark!: { [key: string]: string };

  constructor(
    public moodService: MoodService,
    protected dialog: MatDialog,
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.MoodClassesDark = this.moodService.getComponentMoodClassesDark();
  }

  openModal(): void {
    const dialogRef = this.dialog.open(SongViewComponent, {
      data: { text: this.text, secondaryText: this.secondaryText, imageUrl: this.imageUrl } // Pass trackName, artistName, and imageUrl
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  trimText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  get trimmedText(): string {
    return this.trimText(this.text, 20); // Adjust the max length as needed
  }

  get trimmedSecondaryText(): string {
    return this.trimText(this.secondaryText, 30); // Adjust the max length as needed
  }
}
