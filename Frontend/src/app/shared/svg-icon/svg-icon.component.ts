import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './../../services/theme.service';
import { MoodService } from '../../services/mood-service.service';

@Component({
    selector: 'app-svg-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './svg-icon.component.html',
    styleUrls: ['./svg-icon.component.css'],
})
export class SvgIconComponent {
      //Mood Service Variables
    currentMood!: string;
    moodComponentClasses!:{ [key: string]: string };
    backgroundMoodClasses!:{ [key: string]: string };

    constructor(private themeService: ThemeService, public moodService: MoodService) {
        this.currentMood = this.moodService.getCurrentMood(); 
        this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
        this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }

    @Input() svgPath?: string;
    @Input() fillColor?: string;
    @Input() selected?: boolean;
    @Output() svgClick = new EventEmitter<void>();

    onClick() {
        this.svgClick.emit();
    }

    circleColor(): string {
        return this.themeService.isDarkModeActive()
            ? this.moodComponentClasses[this.moodService.getCurrentMood()]
            : 'rgba(238, 2, 88, 0.5)';
    }
}
