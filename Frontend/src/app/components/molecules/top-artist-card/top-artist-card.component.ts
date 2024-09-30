import { Component,Input } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-artist-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './top-artist-card.component.html',
  styleUrl: './top-artist-card.component.css'
})

export class TopArtistCardComponent {

  @Input() imageUrl!: string;
  @Input() text!: string;
  @Input() secondaryText!: string;
  //Mood Service Variables
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };
  MoodClassesDark!:{[key: string]: string};

  constructor(
    public moodService: MoodService,
    private router: Router,
  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.MoodClassesDark = this.moodService.getComponentMoodClassesDark();
  }

  openArtistProfile(): void {
    this.router.navigate(['/artist-profile']);
  } 

}
