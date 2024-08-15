import { Component, Input } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
    @Input() pageTitle?: string;
    moodComponentClasses!:{ [key: string]: string };
    constructor (public moodService: MoodService ) {
        this.pageTitle = "Home";
        this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    }
}
