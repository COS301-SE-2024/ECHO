//angular imports
import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
//services
import {ScreenSizeService} from './../../services/screen-size-service.service';
//Component Template imports 
import {DeskRegisterComponent} from './../../components/templates/desktop/desk-register/desk-register.component';
import {MobileregisterComponent} from './../../components/templates/mobile/mobileregister/mobileregister.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, DeskRegisterComponent,MobileregisterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  screenSize?: string;
  constructor( private screenSizeService: ScreenSizeService){
  }
  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
}

