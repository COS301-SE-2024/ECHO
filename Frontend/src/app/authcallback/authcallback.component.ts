import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: "app-auth-callback",
  template: "<div class='bg-stone-900 w-screen h-screen'><p class='text-gray-300 top-1/2 left-1/2'>Processing login...</p></div>",
  standalone: true
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const tokens = this.parseHashParams(hash);
      if (tokens.accessToken && tokens.refreshToken) {
        this.authService.sendTokensToServer(tokens).subscribe({
          next: (res: any) => {
            console.log('Login successful:', res);
            this.router.navigate(['/home']);
          },
          error: (err: any) => {
            alert('Error processing login:' + err);
            this.router.navigate(['/login']);
          }
        });
      } else {
        alert("Oops! Something went wrong. Please try again.");
        this.router.navigate(['/login']);
      }
    }
  }

  parseHashParams(hash: string) {
    const params = new URLSearchParams(hash.substring(1));
    return {
      accessToken: params.get('access_token'),
      refreshToken: params.get('refresh_token'),
      providerToken: params.get('provider_token'),
      providerRefreshToken: params.get('provider_refresh_token')
    };
  }
}
