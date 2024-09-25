// mood.component.ts

import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from "../../services/mood-service.service";
import { NavbarComponent } from '../../components/organisms/navbar/navbar.component';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../components/molecules/search-bar/search-bar.component';
import { ProfileComponent } from '../profile/profile.component';
import { MoodDropDownComponent } from '../../components/organisms/mood-drop-down/mood-drop-down.component';

// Define the type for album objects
interface Album {
  title: string;
  artist: string;
  imageUrl: string;
}

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [ NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase, NavbarComponent, SearchBarComponent, ProfileComponent, MoodDropDownComponent ],
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.css']
})
export class MoodComponent implements OnInit {
    screenSize?: string;
    moodComponentClasses!: { [key: string]: string };
    backgroundMoodClasses!: { [key: string]: string };
    title: string = 'Mood';
    searchQuery: string = '';
    albums = [
      { title: 'Wheatus', artist: 'Wheatus', imageUrl: '../assets/images/wheatus.jpg' },
      { title: 'Hot Fuss', artist: 'The Killers', imageUrl: '../assets/images/killers.png' },
      { title: 'From Under the Cork Tree', artist: 'Fall Out Boy', imageUrl: '../assets/images/fallout.png' },
      { title: 'Bad Blood', artist: 'Bastille', imageUrl: '../assets/images/bastille.jpg' },
      { title: 'Damn', artist: 'Kendrick Lamar', imageUrl: '../assets/images/damn.jpg' },
      { title: 'What You Know', artist: 'Two Door Cinema Club', imageUrl: '../assets/images/cinemaclub.jpg' },
      { title: 'Random Access Memories', artist: 'Daft Punk', imageUrl: '../assets/images/ram.jpeg' },
      { title: 'In the Aeroplane Over the Sea', artist: 'Neutral Milk Hotel', imageUrl: '../assets/images/aeroplane.jpg' },
      { title: 'Lemonade', artist: 'Beyoncé', imageUrl: '../assets/images/lemonade.png' },
      { title: 'good kid, m.A.A.d city', artist: 'Kendrick Lamar', imageUrl: '../assets/images/goodkid.jpeg' }
    ];
    
    
    constructor(
      private screenSizeService: ScreenSizeService,
      public moodService: MoodService,
      private router: Router,
    ){
        this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    }

    ngOnInit() {
      this.screenSizeService.screenSize$.subscribe(screenSize => {
        this.screenSize = screenSize;
      });
    }

    changeMood(newMood: string) {
      this.moodService.setCurrentMood(newMood);
      this.title = newMood; // Update title to the new mood
      this.albums = this.getAlbumsForMood(newMood);
    }

    getAlbumsForMood(mood: string): Album[] {
      return [
        { title: `${mood} Album 1`, artist: `Artist ${mood} 1`, imageUrl: 'assets/path/to/album1.jpg' },
        { title: `${mood} Album 2`, artist: `Artist ${mood} 2`, imageUrl: 'assets/path/to/album2.jpg' },
        { title: `${mood} Album 3`, artist: `Artist ${mood} 3`, imageUrl: 'assets/path/to/album3.jpg' }
      ];
    }

    onNavChange($event: string) {}

    onSearchdown(subject:string) {
      this.searchQuery = subject;
      this.title = 'Search';
      this.router.navigate(['/home'], { fragment: 'search' });
    }

    profile() {
      this.router.navigate(['/profile']);
    }
}
