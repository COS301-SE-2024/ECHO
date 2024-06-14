import { Component } from '@angular/core';
import { BottomPlayerComponent } from '../../shared/bottom-player/bottom-player.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { MoodsComponent } from '../../shared/moods/moods.component';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { SongRecommendationComponent } from '../../shared/song-recommendation/song-recommendation.component';
import { ThemeService } from './../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SpotifyService } from "../../services/spotify.service";
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { OnInit } from '@angular/core';

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
