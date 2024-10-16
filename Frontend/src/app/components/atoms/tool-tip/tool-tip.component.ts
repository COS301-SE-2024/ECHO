import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodService } from '../../../services/mood-service.service';
@Component({
  selector: 'app-tool-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-tip.component.html',
  styleUrl: './tool-tip.component.css'
})
export class ToolTipComponent {
  @Input() tooltipText: string = 'Default Tooltip';  // Tooltip text
  @Input() position: string = 'top';                 // Tooltip position (top, right, bottom, left)
  moodComponentClasses!: { [key: string]: string };

  isVisible: boolean = false;  // Tooltip visibility state
  constructor(public moodService: MoodService) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
  }

  // Show tooltip on mouse enter
  @HostListener('mouseenter') onMouseEnter() {
    this.isVisible = true;
  }

  // Hide tooltip on mouse leave
  @HostListener('mouseleave') onMouseLeave() {
    this.isVisible = false;
  }

  // Get Tailwind CSS classes for positioning the tooltip
  getPositionClasses(): string {
    switch (this.position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  }
}