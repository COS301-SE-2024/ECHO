import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './../../services/theme.service';
@Component({
    selector: 'app-svg-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './svg-icon.component.html',
    styleUrls: ['./svg-icon.component.css'],
})
export class SvgIconComponent {
    constructor(private themeService: ThemeService) {}

    @Input() svgPath?: string;
    @Input() fillColor?: string;
    @Input() selected?: boolean;
    @Output() svgClick = new EventEmitter<void>();

    onClick() {
        this.svgClick.emit();
    }

    get circleColor(): string {
        return this.themeService.isDarkModeActive()
            ? 'rgb(238, 2, 88)'
            : 'rgba(238, 2, 88, 0.5)';
    }
}
