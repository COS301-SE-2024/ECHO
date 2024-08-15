import { Component } from '@angular/core';
import { BottomPlayerComponent } from '../../shared/bottom-player/bottom-player.component';
import { NavbarComponent } from '../../components/organisms/navbar/navbar.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { MoodsComponent } from '../../shared/moods/moods.component';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import { SearchBarComponent } from '../../components/molecules/search-bar/search-bar.component';
import { SongRecommendationComponent } from '../../shared/song-recommendation/song-recommendation.component';
import { ThemeService } from './../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { OnInit } from '@angular/core';
import {TopCardComponent} from '../../shared/top-card/top-card.component';
import {TopArtistCardComponent} from "../../shared/top-artist-card/top-artist-card.component";
@Component({
  selector: 'app-user-library',
  standalone: true,
  imports: [ 
        SongRecommendationComponent,
        NavbarComponent,
        NgClass,
        NgForOf,
        NgIf,
        SideBarComponent,
        MoodsComponent,
        BottomPlayerComponent,
        MoodsComponent,
        BottomNavComponent,
        SearchBarComponent,
        TopArtistCardComponent,
        TopCardComponent
   ],
  templateUrl: './user-library.component.html',
  styleUrl: './user-library.component.css'
})
export class UserLibraryComponent implements OnInit {
  title: string = 'Home';
  screenSize?: string;
  currentSelection: string = 'All';
  
  constructor(
      protected themeService: ThemeService,
      private authService: AuthService,
      private router: Router,
      private spotifyService: SpotifyService,
      private screenSizeService: ScreenSizeService
  ) {}
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
        explicit: false,
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
        explicit: false,
    },
    {
        imageUrl: '../../../assets/images/c.png',
        text: 'Prayer in C',
        secondaryText: 'Lilly Wood & The Prick',
        explicit: false,
    },
];
  
switchTheme(): void {
    this.themeService.switchTheme();
}

onNavChange(newNav: string) {
    this.title = newNav;
}

ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
}

profile() {
    this.router.navigate(['/profile']);
}

}
