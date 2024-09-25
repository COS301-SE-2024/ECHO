import { Component,Input  } from '@angular/core';
import {InputComponentComponent} from "./../../../atoms/input-component/input-component.component";
@Component({
  selector: 'app-desk-login',
  standalone: true,
  imports: [InputComponentComponent],
  templateUrl: './desk-login.component.html',
  styleUrl: './desk-login.component.css'
})
export class DeskLoginComponent {

}
