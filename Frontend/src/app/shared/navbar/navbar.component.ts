
import { Component, Output, EventEmitter } from '@angular/core';
import { ThemeService } from './../../services/theme.service';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Router } from '@angular/router';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from '../../services/mood-service.service';

const SVG_PATHS = {
    HOME: 'M48.62,19.21l-23-18c-0.37-0.28-0.87-0.28-1.24,0l-23,18c-0.43,0.34-0.51,0.97-0.17,1.41c0.34,0.43,0.97,0.51,1.41,0.17 L4,19.71V46c0,0.55,0.45,1,1,1h23V31h10v16h7c0.55,0,1-0.45,1-1V19.71l1.38,1.08C47.57,20.93,47.78,21,48,21 c0.3,0,0.59-0.13,0.79-0.38C49.13,20.18,49.05,19.55,48.62,19.21z M22,30h-8v-8h8V30z',
    INSIGHT: 'M 34 4 L 34 50 L 48 50 L 48 4 Z M 2 17 L 2 50 L 16 50 L 16 17 Z M 18 28 L 18 50 L 32 50 L 32 28 Z',
    OTHER: 'M 13 5 A 1.0001 1.0001 0 1 0 13 7 L 37 7 A 1.0001 1.0001 0 1 0 37 5 L 13 5 z M 8 9 A 1.0001 1.0001 0 1 0 8 11 L 42 11 A 1.0001 1.0001 0 1 0 42 9 L 8 9 z M 3 13 C 2.447 13 2 13.448 2 14 L 2 44 C 2 44.552 2.447 45 3 45 L 47 45 C 47.553 45 48 44.552 48 44 L 48 14 C 48 13.448 47.553 13 47 13 L 3 13 z M 25 20 C 28 20 27.75 21 31 21 C 31.641 21 32 21.25 32 22 L 32 25 C 32 26 31 26 31 26 C 27.75 26 27.749938 25 26.460938 25 C 26.056938 25 26 25.342156 26 26.035156 L 26 34 C 26 35.352 25.754 38 22 38 C 18.246 38 18 36.201 18 35 C 18 33.217 19.146 32 22 32 C 24 32 24 31.116 24 30 L 24 21 C 24 20.469 24.195 20 25 20 z'
};

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, SvgIconComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})

export class NavbarComponent {
    //Event Emitter
    @Output() selectedNavChange = new EventEmitter<string>();
    //Options
    options = ['All', 'Moods', 'More'];
    //SVG Paths
    selectedSvg: string;
    homeSvg: string = SVG_PATHS.HOME;
    insightSvg: string = SVG_PATHS.INSIGHT;
    otherSvg2: string = SVG_PATHS.OTHER;
    //Screen Size
    screenSize?: string;
    currentSelection: string = 'All';
     //Mood Service Variables
    currentMood!: string;
    moodComponentClasses!:{ [key: string]: string };
    backgroundMoodClasses!:{ [key: string]: string };
    //Constructor
    constructor(
        public themeService: ThemeService,
        private router: Router,
        private screenSizeService: ScreenSizeService,
        public moodService: MoodService
    ) {
        this.selectedSvg = this.homeSvg; 
        this.currentMood = this.moodService.getCurrentMood(); 
        this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
        this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }
    ngOnInit() {
        this.screenSizeService.screenSize$.subscribe(screenSize => {
            this.screenSize = screenSize;
        });
    }   
    select(svgPath: string): void {
        this.selectedSvg = svgPath;
        let fragment: string = '';
        switch (svgPath) {
            case this.homeSvg:
                fragment = '';
                this.selectedNavChange.emit('Home');
                break;
            case this.insightSvg:
                fragment = 'insight';
                this.selectedNavChange.emit('Insight');
                break;
            case this.otherSvg2:
                fragment = 'library';
                this.selectedNavChange.emit('Library');
                break;
        }
        this.router.navigate(['/home'], { fragment: fragment });
    }

    switchTheme(): void {
        this.themeService.switchTheme();
    }

    isDarkModeActive(): boolean {
        return this.themeService.isDarkModeActive();
    }
    getCurrentButtonClass(option: string): string {
        const isDarkMode = this.themeService.isDarkModeActive();
        const isSelected = this.currentSelection === option;
        return isSelected ? (isDarkMode ? this.moodComponentClasses[this.moodService.getCurrentMood()] : 'bg-pink-light') : (isDarkMode ? 'bg-gray-component' : 'bg-zinc-700');
    }
    getFillColor(svg: string): string {
        const isDarkMode = this.themeService.isDarkModeActive();
        return isDarkMode ? '#D9D9D9' : '#323232';
    }
}
