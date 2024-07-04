import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from "../services/spotify.service";
import { TokenService } from "../services/token.service";

@Component({
  selector: "app-auth-callback",
  template: "<div class='bg-stone-900 w-screen h-screen'><div class='left-1/2 top-1/2'><p class='text-gray-300'>Processing login...</p></div></div>",
  standalone: true
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private spotifyService: SpotifyService, private tokenService: TokenService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const tokens = this.parseHashParams(hash);
      if (tokens.accessToken && tokens.refreshToken) {
        this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
        this.authService.sendTokensToServer(tokens).subscribe({
          next: async (res: any) => {
            console.log('Login successful:', res);
            await this.spotifyService.init();
            this.router.navigate(['/home']);
          },
          error: (err: any) => {
            alert('Error processing login:' + err);
            this.router.navigate(['/login']);
          }
        });
      }
      else {
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
      providerRefreshToken: params.get('provider_refresh_token'),
      code: params.get('code')
    };
  }
}
