// `Frontend/src/app/components/molecules/top-artist-card/top-artist-card.component.ts`
import { Component, Input } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-artist-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './top-artist-card.component.html',
  styleUrls: ['./top-artist-card.component.css']
})
export class TopArtistCardComponent {
  @Input() imageUrl!: string;
  @Input() text!: string;
  @Input() secondaryText!: string;

  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  MoodClassesDark!: { [key: string]: string };

  constructor(
    public moodService: MoodService,
    private router: Router,
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.MoodClassesDark = this.moodService.getComponentMoodClassesDark();
  }

  get trimmedText(): string {
    return this.trimText(this.text, 16);
  }

  get trimmedSecondaryText(): string {
    return this.trimText(this.secondaryText, 16);
  }

  openArtistProfile(): void {
    this.router.navigate(['/artist-profile']);
  }

  trimText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
