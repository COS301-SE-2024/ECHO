import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
import { MoodService } from "../../../services/mood-service.service";

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  //Mood Service Variables
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  moodClassesDark!: { [key: string]: string };
  selectedIndex:string = 'home';
  constructor(private router: Router,public moodService: MoodService) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.moodClassesDark = this.moodService.getComponentMoodClassesDark();
  }
  selectedIndexChanged(index: string){
    this.selectedIndex = index;
  }

  goHome(){
    this.router.navigate(['/home']);
  }
  goSearch(){
    this.router.navigate(['/search']);
  }
  goInsights(){
    this.router.navigate(['/insights']);
  }
  goLibrary(){
    this.router.navigate(['/library']);
  }
}
