import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.css']
})
export class SvgIconComponent {
  @Input() svgPath?: string;
  @Input() fillColor?: string;
  @Output() svgClick = new EventEmitter<void>();

  onClick() {
    this.svgClick.emit();
  }
}