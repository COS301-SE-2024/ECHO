import { Component } from '@angular/core';
import { NavbarComponent } from './../../../organisms/navbar/navbar.component';
import { SideBarComponent } from './../../../organisms/side-bar/side-bar.component';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [NavbarComponent,SideBarComponent],
  templateUrl: './left.component.html',
  styleUrl: './left.component.css'
})
export class LeftComponent {

}
