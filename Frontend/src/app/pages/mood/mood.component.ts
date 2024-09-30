import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from "../../services/mood-service.service";
import { SearchService } from '../../services/search.service';  // <-- Import SearchService
import { NavbarComponent } from '../../components/organisms/navbar/navbar.component';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../components/molecules/search-bar/search-bar.component';
import { ProfileComponent } from '../profile/profile.component';
import { MoodDropDownComponent } from '../../components/organisms/mood-drop-down/mood-drop-down.component';
import { BackButtonComponent } from '../../components/atoms/back-button/back-button.component';
import { PageTitleComponent } from '../../components/atoms/page-title/page-title.component';
import { Track } from '../../services/search.service';
import { ProviderService } from "../../services/provider.service";
import { YouTubeService } from "../../services/youtube.service";
import { SpotifyService } from "../../services/spotify.service";  // <-- Use Track interface
import { PlayIconComponent } from '../../components/organisms/play-icon/play-icon.component';

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase, NavbarComponent, SearchBarComponent, ProfileComponent, MoodDropDownComponent, BackButtonComponent, PageTitleComponent,PlayIconComponent],
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.css']
})
export class MoodComponent implements OnInit {
  screenSize?: string;
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  title: string = 'Mood';
  searchQuery: string = '';
  albums: { title: string, artist: string, imageUrl: string }[] = []; // Store albums dynamically

  constructor(
    private screenSizeService: ScreenSizeService,
    public moodService: MoodService,
    private searchService: SearchService,  // <-- Inject SearchService
    private router: Router,
    private providerService: ProviderService,
    private youtubeService: YouTubeService,
    private spotifyService: SpotifyService

  ) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
  }

  ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });

    // Load initial mood (you can customize this if you want a specific mood to load initially)
    this.changeMood(this.moodService.getCurrentMood());
  }

  // Change mood and fetch corresponding albums or tracks
  changeMood(newMood: string) {
    this.moodService.setCurrentMood(newMood);
    this.title = newMood; // Update title to the new mood

    // Fetch albums or tracks for the selected mood
    this.searchService.getSongsByMood(newMood).subscribe(
      (response: { imageUrl: string, tracks: Track[] }) => {  // Update the expected response type
        this.albums = response.tracks.map(track => ({
          title: track.name,
          artist: track.artistName,
          imageUrl: track.albumImageUrl || 'assets/default-album.png',  // Use default image if no album art
        }));
      },
      (error: any) => {
        console.error(`Failed to load tracks for mood ${newMood}:`, error);
      }
    );
  }

  onNavChange($event: string) {}

  onSearchdown(subject: string) {
    this.searchQuery = subject;
    this.title = 'Search';
    this.router.navigate(['/home'], { fragment: 'search' });
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  playTrack(title: string, artist: string)
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.spotifyService.getTrackDetailsByName(title, artist).then(async (track) =>
      {
        console.log(track);
        await this.spotifyService.playTrackById(track.id);
      });
    }
    else
    {
      this.youtubeService.getTrackByName(title, artist).then(async (track) =>
      {
        await this.youtubeService.playTrackById(track.id);
      });
    }
  }
}
