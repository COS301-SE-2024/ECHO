import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    NgForOf,
    NgIf,
    NgClass,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  constructor(protected themeService: ThemeService) {
  }

  title: string = 'Home';
  selectedOption: string = 'upNext';

  upNextCardData = [
    { imageUrl: '../../../assets/images/album.png', text: 'Nikes', secondaryText: 'Frank Ocean', explicit: true },
    {
      imageUrl: '../../../assets/images/kendrick.png',
      text: 'Not Like Us',
      secondaryText: 'Kendrick Lamar',
      explicit: true,
    },
    {
      imageUrl: '../../../assets/images/fallout.png',
      text: 'Dance Dance',
      secondaryText: 'Fall Out Boy',
      explicit: false,
    },
    {
      imageUrl: '../../../assets/images/two.jpg',
      text: 'What You Know',
      secondaryText: 'Two Door Cinema Club',
      explicit: false,
    },
    { imageUrl: '../../../assets/images/damn.jpg', text: 'PRIDE.', secondaryText: 'Kendrick Lamar', explicit: true },
    { imageUrl: '../../../assets/images/tracy.jpg', text: 'Fast Car', secondaryText: 'Tracy Chapman', explicit: false },
    { imageUrl: '../../../assets/images/mac.jpg', text: 'Circles', secondaryText: 'Mac Miller', explicit: false },
  ];

  recentListeningCardData = [
    {
      imageUrl: '../../../assets/images/red.jpg',
      text: 'Californication',
      secondaryText: 'Red Hot Chilli Peppers',
      explicit: false,
    },
    {
      imageUrl: '../../../assets/images/post.jpg',
      text: 'Too cool to die',
      secondaryText: 'Post Malone',
      explicit: true,
    },
    {
      imageUrl: '../../../assets/images/killers.png',
      text: 'Mr. Brightside',
      secondaryText: 'The Killers',
      explicit: false,
    },
    { imageUrl: '../../../assets/images/glass.jpg', text: 'Youth', secondaryText: 'Glass Animals', explicit: false },
    {
      imageUrl: '../../../assets/images/wheatus.jpg',
      text: 'Teenage Dirtbag',
      secondaryText: 'Wheatus',
      explicit: true,
    },
    { imageUrl: '../../../assets/images/bastille.jpg', text: 'Pompeii', secondaryText: 'Bastille', explicit: false },
    {
      imageUrl: '../../../assets/images/c.png',
      text: 'Prayer in C',
      secondaryText: 'Lilly Wood & The Prick ft. Robin Schulz',
      explicit: false,
    },
  ];

  getSelectedCardData(): any[] {
    return this.selectedOption === 'upNext' ? this.upNextCardData : this.recentListeningCardData;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
