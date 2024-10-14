//angular imports
import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
//services
import {ScreenSizeService} from './../../services/screen-size-service.service';
//components
import {HomeComponent} from './../../components/templates/desktop/home/home.component';
import { MobilehomeComponent } from '../../components/templates/mobile/mobilehome/mobilehome.component';
@Component({
  selector: 'app-homes',
  standalone: true,
  imports: [CommonModule,HomeComponent,MobilehomeComponent],
  templateUrl: './homes.component.html',
  styleUrl: './homes.component.css'
})
export class HomesComponent {
  screenSize?: string;
  constructor( private screenSizeService: ScreenSizeService){
  }
  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
}
