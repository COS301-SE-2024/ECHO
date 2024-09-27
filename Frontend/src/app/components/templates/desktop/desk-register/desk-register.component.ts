import { Component, OnInit,ViewChild } from '@angular/core';
import { SpotifyLoginComponent } from '../../../../components/organisms/spotify-login/spotify-login.component';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../../components/organisms/toast/toast.component';
import { CommonModule } from '@angular/common';
import { AppleLoginComponent } from "../../../../components/organisms/apple-login/apple-login.component";
import { GoogleLoginComponent } from "../../../../components/organisms/google-login/google-login.component";

@Component({
  selector: 'app-desk-register',
  standalone: true,
  imports: [SpotifyLoginComponent, FormsModule, ToastComponent, CommonModule, AppleLoginComponent, GoogleLoginComponent],
  templateUrl: './desk-register.component.html',
  styleUrl: './desk-register.component.css'
})
export class DeskRegisterComponent {
    username: string = '';
    email: string = '';
    password: string = '';
    showModal: boolean = false;
    showAboutModal: boolean = false;
    showContactModal: boolean = false;
    showPrivacyModal: boolean = false;

    @ViewChild(ToastComponent) toastComponent!: ToastComponent;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
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
        (error) => this.toastComponent.showToast("Ensure password contains at least one lower case letter, one capital letter, one number, and one symbol.", 'error')
      );
    }
    navigateTologin(){
      this.router.navigate(['/login']);
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
}

