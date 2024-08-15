import { Component } from '@angular/core';
import {NavbarComponent} from './../../../organisms/navbar/navbar.component';
import {InfoIconComponent} from './../../../organisms/info-icon/info-icon.component';
import {ProfileAtomicComponent} from './../../../organisms/profile/profile.component';
import {MoodDropDownComponent} from './../../../organisms/mood-drop-down/mood-drop-down.component';
@Component({
  selector: 'app-other-nav',
  standalone: true,
  imports: [NavbarComponent,InfoIconComponent,ProfileAtomicComponent,MoodDropDownComponent],
  templateUrl: './other-nav.component.html',
  styleUrl: './other-nav.component.css'
})
export class OtherNavComponent {

}
