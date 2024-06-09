import { Component, OnInit,ViewChild } from '@angular/core';
import { SpotifyLoginComponent } from '../../spotify-login/spotify-login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [SpotifyLoginComponent, FormsModule, ToastComponent, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    username: string = '';
    email: string = '';
    password: string = '';
    @ViewChild(ToastComponent) toastComponent!: ToastComponent;

    constructor(
        private authService: AuthService,
        private router: Router,
        private themeService: ThemeService,
    ) {}

    ngOnInit() {
        this.theme();
    }

    theme() {
        if (!this.themeService.isDarkModeActive()) {
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

    register() {
        if (this.username === '' || this.email === '' || this.password === '') {
            alert('Please fill in all fields');
            return;
        }
        this.authService
            .register(this.username, this.email, this.password)
            .subscribe(
                (response) => {
                    if (response.user) {
                        console.log('Account created successfully!', response);
                        this.toastComponent.showToast('Account created successfully!', 'success');
                        setTimeout(() => {
                            this.router.navigate(['/home']);
                        }, 1000);
                    } else {
                        console.error(
                            'Account creation unsuccessful.',
                            response,
                        );
                        this.toastComponent.showToast('Account creation unsuccessful. Please try again.', 'info');
                    }
                },
                (error) => {
                    console.error('Error logging in user', error);
                    this.toastComponent.showToast('Error logging in user', 'error');
                },
            );
    }
}
