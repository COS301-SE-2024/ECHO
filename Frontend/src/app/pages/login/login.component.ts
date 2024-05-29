import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import { SpotifyLoginComponent} from "../../spotify-login/spotify-login.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    SpotifyLoginComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  spotify() {
    var email: any;
    email = document.getElementById('email');
    var password: any;
    password = document.getElementById('password');

    email.required = false;
    password.required = false;
  }
}
