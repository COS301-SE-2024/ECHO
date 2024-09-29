import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private spotifyService: SpotifyService,
    private tokenService: TokenService,
    private providerService: ProviderService
  ) {}

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const tokens = this.parseHashParams(hash);

      // Ensure access and refresh tokens are present
      if (tokens.accessToken && tokens.refreshToken) {
        // Set access and refresh tokens
        await this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);

        // Send all tokens, including optional provider tokens, to the server
        this.authService.sendTokensToServer({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          providerToken: tokens.providerToken || null,  // Optional, fallback to null
          providerRefreshToken: tokens.providerRefreshToken || null  // Optional, fallback to null
        }).subscribe({
          next: async (res: any) => {
            console.log("Login successful", res);
            await this.spotifyService.init();
            await this.router.navigate(['/home']);
          },
          error: (err: any) => {
            console.error("Error processing login", err);
            this.router.navigate(['/login']);
          }
        });
      } else {
        console.error("No tokens found in URL hash");
        this.router.navigate(['/login']);
      }
    }
  }

  // Function to parse tokens from the URL hash
  parseHashParams(hash: string) {
    const params = new URLSearchParams(hash.substring(1)); // Remove the '#' and parse
    return {
      accessToken: params.get('access_token'),
      refreshToken: params.get('refresh_token'),
      providerToken: params.get('provider_token'),
      providerRefreshToken: params.get('provider_refresh_token'),
      expiresAt: params.get('expires_at')
    };
  }
}
