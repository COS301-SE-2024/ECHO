import { Component } from '@angular/core';
import { SpotifyLoginComponent} from "../../spotify-login/spotify-login.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SpotifyLoginComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  spotify() {
    var email: any;
    email = document.getElementById('email');
    var password: any;
    password = document.getElementById('password');

    email.required = false;
    password.required = false;
  }
}
