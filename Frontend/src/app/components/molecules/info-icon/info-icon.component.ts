import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../atoms/svg-icon/svg-icon.component';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass } from '@angular/common';


const SVG_PATHS = {
  INFO: "M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"
};
@Component({
  selector: 'app-info-icon',
  standalone: true,
  imports: [],
  templateUrl: './info-icon.component.html',
  styleUrl: './info-icon.component.css'
})
export class InfoIconComponent {
  infoSvg: string = SVG_PATHS.INFO;
  moodComponentClasses!: { [key: string]: string };
  moodColors: string[] = [];

  constructor(private router: Router, public moodService: MoodService) {}

  ngOnInit() {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
  }

  openHelpMenu() {
    this.router.navigate(['/help']);
  }

  getFillColor(): any {
    return this.moodService.getRBGAColor(this.moodService.getCurrentMood());
  }
}
