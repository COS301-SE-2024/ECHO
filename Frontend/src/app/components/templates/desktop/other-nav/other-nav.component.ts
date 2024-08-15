import { Component } from '@angular/core';
import {NavbarComponent} from './../../../organisms/navbar/navbar.component';
import {InfoIconComponent} from './../../../organisms/info-icon/info-icon.component';
import {ProfileAtomicComponent} from './../../../organisms/profile/profile.component';
@Component({
  selector: 'app-other-nav',
  standalone: true,
  imports: [NavbarComponent,InfoIconComponent,ProfileAtomicComponent],
  templateUrl: './other-nav.component.html',
  styleUrl: './other-nav.component.css'
})
export class OtherNavComponent {

}
