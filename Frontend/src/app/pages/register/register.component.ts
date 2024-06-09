import { Component, OnInit } from "@angular/core";
import { SpotifyLoginComponent } from "../../spotify-login/spotify-login.component";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [SpotifyLoginComponent, FormsModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css"
})
export class RegisterComponent {
  username: string = "";
  email: string = "";
  password: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
  }

  ngOnInit() {
    this.theme();
  }

  theme() {
    if (!this.themeService.isDarkModeActive()) {
      this.themeService.switchTheme();
    }
  }

  spotify() {
    if (typeof window !== 'undefined') {
      window.location.href = 'http://localhost:3000/api/auth/oauth-signin';
    }
  }

  async register() {
    if (this.username === '' || this.email === '' || this.password === '') {
      alert('Please fill in all fields');
      return;
    }

    const metadata = {
      username: this.username,
      name: this.username,
    };

    this.authService.signUp(this.email, this.password, metadata).subscribe(
      () => this.router.navigate(["/home"]),
      (error) => console.error("Error signing up:", error)
    );
  }
}
