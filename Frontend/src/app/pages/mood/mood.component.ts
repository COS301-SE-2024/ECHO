import { Component } from '@angular/core';
import { NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from "../../services/mood-service.service";
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { ProfileComponent } from '../profile/profile.component';
import { MoodDropDownComponent } from '../../shared/mood-drop-down/mood-drop-down.component';


@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [ NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase, NavbarComponent, SearchBarComponent, ProfileComponent, MoodDropDownComponent ],
  templateUrl: './mood.component.html',
  styleUrl: './mood.component.css'
})
export class MoodComponent {
    screenSize?: string;
    moodComponentClasses!:{ [key: string]: string };
    backgroundMoodClasses!:{ [key: string]: string };
    currentSelection: string = 'All';
    searchQuery: string = '';
    title: string = 'Mood';
    
    constructor(
      private screenSizeService: ScreenSizeService,
      public moodService: MoodService,
      private router: Router,
    ){
        this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
        this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }

    async ngOnInit() {
      this.screenSizeService.screenSize$.subscribe(screenSize => {
        this.screenSize = screenSize;
      });
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
