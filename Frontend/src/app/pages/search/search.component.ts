import { Component,Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { ThemeService } from './../../services/theme.service';
import { Router } from '@angular/router';
import {NavbarComponent} from "./../../shared/navbar/navbar.component";
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { TopResultComponent } from '../../shared/top-result/top-result.component';
import { MoodService } from '../../services/mood-service.service';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf,NgForOf,NgClass,NavbarComponent,SearchBarComponent,TopResultComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  //Mood Service Variables
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  @Input() searchQuery: string ='';
  screenSize?: string;
  title?: string;

  constructor(private screenSizeService: ScreenSizeService,protected themeService: ThemeService,private router: Router,
    public moodService: MoodService
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    
  }
  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
  onNavChange(newNav: string) {
    this.title = newNav;
  }
  onSearchdown(seaarch:string) {
    this.searchQuery = seaarch;
  }
  switchTheme(): void {
    this.themeService.switchTheme();
  }
  profile() {
    this.router.navigate(['/profile']);
  }
  songs : any = [ 
    {},
    {},
    {} ,{},
    {},
    {} ,{},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
];
}
