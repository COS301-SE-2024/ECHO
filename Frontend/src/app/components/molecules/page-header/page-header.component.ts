import { Component, Input } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass } from "@angular/common";
import { PageTitleComponent } from '../../atoms/page-title/page-title.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgClass,PageTitleComponent],
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
