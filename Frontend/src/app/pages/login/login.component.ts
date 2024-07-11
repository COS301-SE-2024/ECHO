import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { SpotifyLoginComponent } from '../../shared/spotify-login/spotify-login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { CommonModule } from '@angular/common';
import { GoogleLoginComponent } from "../../shared/google-login/google-login.component";
import { AppleLoginComponent } from "../../shared/apple-login/apple-login.component";
import { ProviderService } from "../../services/provider.service";

@Component({
    selector: 'app-login',
    standalone: true,
  imports: [CommonModule, FormsModule, SpotifyLoginComponent, ToastComponent, GoogleLoginComponent, AppleLoginComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    email: string = '';
    password: string = '';
    username: string = '';
    showModal: boolean = false;
    showAboutModal: boolean = false;
    showContactModal: boolean = false;
    showPrivacyModal: boolean = false;

    @ViewChild(ToastComponent) toastComponent!: ToastComponent;

    constructor(
        private authService: AuthService,
        private router: Router,
        private themeService: ThemeService,
        private providerService: ProviderService
    ) {}

    ngOnInit() {
        this.theme();
    }

    theme() {
        if (!this.themeService.isDarkModeActive()) {
            this.themeService.switchTheme();
        }
    }

    async spotify() {
      if (typeof window !== 'undefined') {
        this.authService.signInWithOAuth();
      }
    }

    login() {
      this.providerService.setProviderName('email');
        this.authService.signIn(this.email, this.password).subscribe(
            response => {
                if (response.user) {
                    localStorage.setItem('username', this.email);
                    console.log('User logged in successfully', response);
                    this.toastComponent.showToast('User logged in successfully', 'success');
                    setTimeout(() => {
                        this.router.navigate(['/home']);
                    }, 1000);
                } else {
                    console.error('Error logging in user', response);
                    this.toastComponent.showToast('Invalid username or password', 'info');
                }
            },
            error => {
                console.error('Error logging in user', error);
                this.toastComponent.showToast('There was an issue logging in', 'error');
            }
        );
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
      }

      toggleAboutModal(): void {
        this.showAboutModal = !this.showAboutModal;
      }

      toggleContactModal(): void {
        this.showContactModal = !this.showContactModal;
      }

      togglePrivacyModal(): void {
        this.showPrivacyModal = !this.showPrivacyModal;
      }

      closeModal(): void {
        this.showModal = false;
        this.showAboutModal = false;
        this.showContactModal = false;
        this.showPrivacyModal = false;
      }

  google() {
    this.providerService.setProviderName('google');
  }
}
