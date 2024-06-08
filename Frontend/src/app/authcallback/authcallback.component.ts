import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Assuming you have an AuthService for handling API calls

@Component({
  selector: "app-auth-callback",
  template: "<p>Processing login...</p>",
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
            this.router.navigate(['/home']); // or any other route
          },
          error: (err: any) => {
            console.log('Error processing login:', err);
            this.router.navigate(['/profile']); // fallback route
          }
        });
      } else {
        console.log('Tokens not found in URL');
        this.router.navigate(['/profile']);
      }
    }
  }

  parseHashParams(hash: string) {
    const params = new URLSearchParams(hash.substring(1));
    return {
      accessToken: params.get('access_token'),
      refreshToken: params.get('refresh_token'),
      providerToken: params.get('provider_token')
    };
  }
}
