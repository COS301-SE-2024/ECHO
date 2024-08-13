//angular imports
import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
//services
import {ScreenSizeService} from './../../services/screen-size-service.service';
//Component Template imports 
import {DeskLoginComponent} from './../../components/templates/desktop/deskLogin/desk-login.component';
import {MobileloginComponent} from './../../components/templates/mobile/mobileLogin/mobilelogin.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, DeskLoginComponent, MobileloginComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponentview {
  screenSize?: string;
  constructor( private screenSizeService: ScreenSizeService){
  }
  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
}
