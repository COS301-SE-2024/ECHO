import { Component } from '@angular/core';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { NgForOf, NgIf } from '@angular/common';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { BottomPlayerComponent } from '../../shared/bottom-player/bottom-player.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NavbarComponent,
    NgIf,
    SideBarComponent,
    MatCard,
    MatCardContent,
    MatButtonModule,
    MatIconModule,
    NgForOf,
    BottomPlayerComponent,
    SearchBarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  recentListeningCardData = [
    {
      imageUrl: '../../../assets/images/red.jpg',
      text: 'Californication',
      secondaryText: 'Red Hot Chilli Peppers',
      explicit: false,
    },
    {
      imageUrl: '../../../assets/images/post.jpg',
      text: 'Too Cool To Die',
      secondaryText: 'Post Malone',
      explicit: true,
    },
    {
      imageUrl: '../../../assets/images/killers.png',
      text: 'Mr. Brightside',
      secondaryText: 'The Killers',
      explicit: false,
    },
    {
      imageUrl: '../../../assets/images/glass.jpg',
      text: 'Youth',
      secondaryText: 'Glass Animals',
      explicit: false
    },
    {
      imageUrl: '../../../assets/images/wheatus.jpg',
      text: 'Teenage Dirtbag',
      secondaryText: 'Wheatus',
      explicit: true,
    },
    {
      imageUrl: '../../../assets/images/bastille.jpg',
      text: 'Pompeii',
      secondaryText: 'Bastille',
      explicit: false
    },
    {
      imageUrl: '../../../assets/images/c.png',
      text: 'Prayer in C',
      secondaryText: 'Lilly Wood & The Prick',
      explicit: false,
    },
  ];

  artists = [
    {
      imageUrl: '../../../assets/images/ken.jpg',
      text: 'Kendrick Lamar',
    },
    {
      imageUrl: '../../../assets/images/malone.jpg',
      text: 'Post Malone',
    },
    {
      imageUrl: '../../../assets/images/thekill.jpg',
      text: 'The Killers',
    },
    {
      imageUrl: '../../../assets/images/rhcp.jpg',
      text: 'Red Hot Chilli Peppers',
    },
    {
      imageUrl: '../../../assets/images/bob.jpg',
      text: 'Bob Marley',
    },
    {
      imageUrl: '../../../assets/images/miller.jpg',
      text: 'Mac Miller',
    },
    {
      imageUrl: '../../../assets/images/cinemaclub.jpg',
      text: 'Two Door Cinema Club',
    },
  ];


  constructor(protected themeService: ThemeService, private authService: AuthService, private router: Router) {
  }

  switchTheme() {
    this.themeService.switchTheme();
  }

  onNavChange($event: string) {

  }
}