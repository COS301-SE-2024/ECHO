import { Component, inject, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from "../services/spotify.service";
import { TokenService } from "../services/token.service";
import { ProviderService } from "../services/provider.service";

@Component({
  selector: "app-auth-callback",
  template: `
    <div class="flex flex-col items-center justify-center h-screen bg-desktop-bg">
      <h1 class="text-2xl font-bold mb-4 text-gray-300">Processing login</h1>
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  `,
  standalone: true
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private spotifyService: SpotifyService, private tokenService: TokenService) {}

  private providerService = inject(ProviderService);
  ngOnInit() {
    if (typeof window !== 'undefined') {
      const provider:string = 'email';
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
            alert(this.providerService.getProviderName());
            if (this.providerService.getProviderName() === 'google')
            {
              this.router.navigate(['/home']);
            }
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
