import { Component, OnInit,ViewChild, } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SpotifyLoginComponent } from '../../spotify-login/spotify-login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import {ToastComponent} from '../../shared/toast/toast.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [NgOptimizedImage, SpotifyLoginComponent, FormsModule,ToastComponent,CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    @ViewChild(ToastComponent) toastComponent!: ToastComponent;

    constructor(
        private authService: AuthService,
        private router: Router,
        private themeService: ThemeService,
    ) {}
    theme() {
        if (!this.themeService.isDarkModeActive()) {
            this.themeService.switchTheme();
        }
    }
    ngOnInit() {
        this.theme();
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
            (response) => {
                if (response.user) {
                    localStorage.setItem('username', this.username);
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
            (error) => {
                console.error('Error logging in user', error);
                this.toastComponent.showToast('There was an Issue Logging In', 'error');
            },
        );
    }
}
