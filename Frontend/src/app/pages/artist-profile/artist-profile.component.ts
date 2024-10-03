import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/organisms/navbar/navbar.component';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { SideBarComponent } from '../../components/organisms/side-bar/side-bar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditProfileModalComponent } from '../../components/organisms/edit-profile-modal/edit-profile-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit } from '@angular/core';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { CommonModule } from '@angular/common';
import { SpotifyService } from "../../services/spotify.service";
import { InfoBarComponent } from '../../components/organisms/info-bar/info-bar.component';
import { MoodService } from '../../services/mood-service.service';
import { BackButtonComponent } from '../../components/atoms/back-button/back-button.component';
import { TopCardComponent } from '../../components/molecules/top-card/top-card.component';

@Component({
    selector: 'app-artist-profile',
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
        EditProfileModalComponent,
        CommonModule,
        InfoBarComponent,
        NgClass,
        BackButtonComponent,
        TopCardComponent
    ],
    templateUrl: './artist-profile.component.html',
    styleUrl: './artist-profile.component.css',
})

export class ArtistProfileComponent implements AfterViewInit {
  imgpath: string = 'back.jpg';
  screenSize?: string;
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  artist = {
      name: 'Kendrick Lamar',
      description: 'Kendrick Lamar is a Grammy-winning rapper and songwriter from Compton, California, known for his thought-provoking lyrics and storytelling. His albums, like Good Kid, M.A.A.D City, To Pimp a Butterfly, and DAMN., explore themes of identity, societal struggles, and personal growth. Widely regarded as one of the most influential voices in hip-hop, Kendricks music blends sharp social commentary with powerful narratives, earning him accolades like the Pulitzer Prize for Music.',
      genres: ['Hip-Hop', 'Rap', 'Conscious Hip-Hop'],
      image: './assets/images/kendrick.jpg',
      topSongs: ['HUMBLE.', 'Swimming Pools (Drank)', 'Money Trees', 'Alright', 'DNA.'],
      albums: ['Good Kid, M.A.A.D City', 'To Pimp a Butterfly', 'DAMN.', 'Mr. Morale & The Big Steppers'],
      playlists: ['Kendrick Essentials', 'RapCaviar', 'Hip-Hop Hits', 'Workout Mix'],
  };

  username: string = '';

  constructor(
      private authService: AuthService,
      private router: Router,
      protected dialog: MatDialog,
      private screenSizeService: ScreenSizeService,
      private spotifyService: SpotifyService,
      public moodService: MoodService,
  ) {
    this.currentMood = this.moodService.getCurrentMood();
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
  }

  ngAfterViewInit(): void {
    let currUser = this.authService.currentUser().subscribe((res) => {
      this.username = res.user.user_metadata.name;
      this.imgpath = res.user.user_metadata.picture;
    });
  }

  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }

  getAlbumArt(item: string): string {
      // Placeholder function to return a default album art
      return '../assets/images/damn.jpeg';
  }

  playSong(song: string): void {
    // Logic to play the selected song
    console.log(`Playing song: ${song}`);
  }

  viewAlbum(album: string): void {
    // Logic to view the selected album
    console.log(`Viewing album: ${album}`);
  }

  viewPlaylist(playlist: string): void {
    // Logic to view the selected playlist
    console.log(`Viewing playlist: ${playlist}`);
  }
}
