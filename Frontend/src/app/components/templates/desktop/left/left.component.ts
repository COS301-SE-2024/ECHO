import { Component } from '@angular/core';
import { NavbarComponent } from './../../../organisms/navbar/navbar.component';
import { SideBarComponent } from './../../../organisms/side-bar/side-bar.component';
import { CommonModule } from "@angular/common";
import { SvgIconComponent } from '../../../atoms/svg-icon/svg-icon.component';
import { MoodService } from "../../../../services/mood-service.service";

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [NavbarComponent, SideBarComponent, CommonModule, SvgIconComponent],
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})
export class LeftComponent {
  constructor(private moodService: MoodService) {}
}