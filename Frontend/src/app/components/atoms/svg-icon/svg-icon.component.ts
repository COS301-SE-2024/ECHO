import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodService } from '../../../services/mood-service.service';

@Component({
    selector: 'app-svg-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './svg-icon.component.html',
    styleUrls: ['./svg-icon.component.css'],
})
export class SvgIconComponent {
    // Mood Service Variables
    moodComponentClasses!: { [key: string]: string };
    @Input() svgPath: string = '';
    @Input() fillColor: string = '#000000';
    @Input() selected: boolean = false;
    @Input() middleColor: string = '#FFFFFF';
    @Input() pathHeight: string = '1'; // Default path height as a string
    @Output() svgClick = new EventEmitter<MouseEvent>();
    @Input() mood?: any;

    hovered: boolean = false;

    constructor(public moodService: MoodService) {}

    ngOnInit() {
        this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    }

    onClick() {
        this.svgClick.emit();
    }

    circleColor(): string {
        if(this.hovered){
            return this.moodComponentClasses[this.mood];
        }else
        {
           return this.moodComponentClasses[this.moodService.getCurrentMood()];
        }
    }

    onMouseEnter() {
        this.hovered = true;
      }
    
      onMouseLeave() {
        this.hovered = false;
      }
 
    getNumericPathHeight(): number {
        return parseFloat(this.pathHeight);
    }
}