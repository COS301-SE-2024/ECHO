import { Component } from '@angular/core';
import { SpotifyLoginComponent} from "../../spotify-login/spotify-login.component";
import { AuthService } from '../../services/auth.service';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SpotifyLoginComponent,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
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

  register() {
    if (this.username === '' || this.email === '' || this.password === '') {
      alert('Please fill in all fields');
      return;
    }
    this.authService.register(this.username, this.email, this.password).subscribe(
      response => {
        if (response.user) {
          console.log('Account created successfully!', response);
          this.router.navigate(['/landing']);
        } else {
          console.error('Account creation unsuccessful.', response);
          alert('Account creation unsuccessful. Please try again.');
        }
      },
      error => {
        console.error('Error logging in user', error);
        //this.errorMessage = 'An error occurred while logging in.';
      }
    );

  }
}
