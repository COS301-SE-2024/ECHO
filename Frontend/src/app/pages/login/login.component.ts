import { Component, OnInit } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { SpotifyLoginComponent } from "../../spotify-login/spotify-login.component";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [NgOptimizedImage, SpotifyLoginComponent, FormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css"
})
export class LoginComponent {
  username: string = "";
  email: string = "";
  password: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private http: HttpClient
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
    window.location.href = 'http://localhost:3000/api/auth/oauth-signin';
    var email: any;
    email = document.getElementById("email");
    var password: any;
    password = document.getElementById("password");

    email.required = false;
    password.required = false;

  }

  login() {
    this.authService.signIn(this.email, this.password).subscribe(
      () => this.router.navigate(["/home"]),
      (error) => console.error("Error signing in:", error)
    );
  }
}
