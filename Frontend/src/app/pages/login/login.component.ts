import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import { SpotifyLoginComponent} from "../../spotify-login/spotify-login.component";
import { AuthService } from '../../services/auth.service';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    SpotifyLoginComponent,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  spotify() {
    var email: any;
    email = document.getElementById('email');
    var password: any;
    password = document.getElementById('password');

    email.required = false;
    password.required = false;
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        if (response.user) {
          console.log('User logged in successfully', response);
          this.router.navigate(['/landing']);
        } else {
          console.error('Error logging in user', response);
          alert('Invalid username or password');
        }
      },
      error => {
        console.error('Error logging in user', error);
        //this.errorMessage = 'An error occurred while logging in.';
      }
    );
  }
}
