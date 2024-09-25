import { Component } from '@angular/core';
import {IconComponent} from './../../molecules/icon/icon.component';
const SVG_PATHS = {
  INFO: "M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"
};
@Component({
  selector: 'app-info-icon',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './info-icon.component.html',
  styleUrl: './info-icon.component.css'
})
export class InfoIconComponent {
  svgString: string = SVG_PATHS.INFO;
  route: string = '/help';
  constructor() {}
  ngOnInit() {}
  openHelpMenu() {
    console.log('Help menu opened');
  }
  getFillColor(): string {
    return 'black';
  }
}
