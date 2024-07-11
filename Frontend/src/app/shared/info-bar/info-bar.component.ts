import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-info-bar',
  standalone: true,
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.css'],
  imports: [MatCard, MatCardContent, NgForOf, NgIf, NgClass],
})
export class InfoBarComponent {
  selectedOption: string = 'Info';

  artist = {
    name: 'Kendrick Lamar',
    description: 'Kendrick Lamar, an influential figure in contemporary music, epitomizes artistic depth and cultural resonance. His discography navigates themes of identity, societal struggle, and personal introspection with poetic precision.',
    genres: ['Hip Hop', 'Jazz', 'Funk'],
    similarArtists: ['J. Cole', 'Chance the Rapper', 'Childish Gambino'],
    topSongs: ['HUMBLE.', 'Alright', 'DNA.']
  };

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
