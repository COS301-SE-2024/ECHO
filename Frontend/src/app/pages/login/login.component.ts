import { Component, OnInit } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import { SpotifyLoginComponent} from "../../spotify-login/spotify-login.component";
import { AuthService } from '../../services/auth.service';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { ThemeService } from '../../services/theme.service';

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
  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    this.theme();
  }

  theme() {
    if (!(this.themeService.isDarkModeActive())) {
      this.themeService.switchTheme();
    }
  }

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
          this.router.navigate(['/home']);
        } else {
          console.error('Error logging in user', response);
          alert('Invalid username or password');
        }
      },
      error => {
        console.error('Error logging in user', error);
      }
    );
  }
}
