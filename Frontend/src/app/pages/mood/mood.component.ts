import { Component } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from "../../services/mood-service.service";
import { NavbarComponent } from '../../shared/navbar/navbar.component';


@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [ NgForOf, NgIf, NgClass, NavbarComponent ],
  templateUrl: './mood.component.html',
  styleUrl: './mood.component.css'
})
export class MoodComponent {
    screenSize?: string;
    moodComponentClasses!:{ [key: string]: string };
    backgroundMoodClasses!:{ [key: string]: string };
    
    constructor(
      private screenSizeService: ScreenSizeService,
      public moodService: MoodService,
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
}
