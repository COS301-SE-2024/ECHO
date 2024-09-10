import { Component } from '@angular/core';
import { NavbarComponent } from './../../../organisms/navbar/navbar.component';
import { SideBarComponent } from './../../../organisms/side-bar/side-bar.component';
import { CommonModule } from "@angular/common";
import { SvgIconComponent } from '../../../atoms/svg-icon/svg-icon.component';
import { MoodService } from "../../../../services/mood-service.service";
import { ExpandableIconComponent } from '../../../organisms/expandable-icon/expandable-icon.component';

const SVG_PATHS = {
  PLUS: 'M20 0 H30 V20 H50 V30 H30 V50 H20 V30 H0 V20 H20 Z',
  MIN: 'M0 20 H50 V30 H0 Z',
};

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [NavbarComponent, SideBarComponent, CommonModule, SvgIconComponent,ExpandableIconComponent],
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})
export class LeftComponent {
  constructor(private moodService: MoodService) {}

  svgString: string = SVG_PATHS.PLUS;
  isSideBarHidden = true;

  toggleSideBar() {
    this.isSideBarHidden = !this.isSideBarHidden;
  }

  handleSvgClick(event: MouseEvent) {
      this.svgString = this.svgString === SVG_PATHS.PLUS ? SVG_PATHS.MIN : SVG_PATHS.PLUS;
  }
}