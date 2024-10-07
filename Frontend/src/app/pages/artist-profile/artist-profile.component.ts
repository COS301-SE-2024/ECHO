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
    description: 'Kendrick Lamar, an influential figure in contemporary music, epitomizes artistic depth and cultural resonance. His discography navigates themes of identity, societal struggle, and personal introspection with poetic precision.',
    genres: ['Hip-Hop', 'Rap', 'Conscious Hip-Hop'],
    similarArtists: ['J. Cole', 'Drake', 'Kanye West'],
    topSongs: ['HUMBLE.', 'Swimming Pools (Drank)', 'Money Trees', 'Alright', 'DNA.'],
    albums: ['Good Kid, M.A.A.D City', 'To Pimp a Butterfly', 'DAMN.', 'Mr. Morale & The Big Steppers'],
    features: ['Goosebumps (with Travis Scott)', 'Control (with Big Sean)', 'Collard Greens (with ScHoolboy Q)', 'Pray for Me (with The Weeknd)'],
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
    if (typeof window !== 'undefined') {
      await this.spotifyService.init();
    }
  }

  onNavChange($event: string) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });


  }

  save() {
    if (localStorage.getItem('path') !== null) {
      // @ts-ignore
      this.imgpath = localStorage.getItem('path');
    }
  }

  refresh() {
    this.authService.currentUser().subscribe((res) => {
      this.username = res.user.user_metadata.username;
    });
  }

  getAlbumArt(song: string): string {
    // Placeholder function to return a default album art
    return '../assets/images/damn.jpeg';
  }
}
