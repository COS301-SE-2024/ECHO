import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SvgIconComponent } from '../../atoms/svg-icon/svg-icon.component';

const SVG_PATHS = {
  PLUS: 'M20 0 H30 V20 H50 V30 H30 V50 H20 V30 H0 V20 H20 Z',
  MIN: 'M0 20 H50 V30 H0 Z',
};

@Component({
  selector: 'app-expandable-icon',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './expandable-icon.component.html',
  styleUrl: './expandable-icon.component.css'
})
export class ExpandableIconComponent {

  svgString: string = SVG_PATHS.MIN;

  @Output() svgClicked = new EventEmitter<void>();

  handleSvgClick(event: MouseEvent) {
    this.svgString = this.svgString === SVG_PATHS.PLUS ? SVG_PATHS.MIN : SVG_PATHS.PLUS;
    this.svgClicked.emit();
  }
}