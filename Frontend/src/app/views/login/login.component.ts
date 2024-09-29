import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenSizeService } from './../../services/screen-size-service.service';
import { DeskLoginComponent } from './../../components/templates/desktop/deskLogin/desk-login.component';
import { MobileloginComponent } from './../../components/templates/mobile/mobilelogin/mobilelogin.component';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DeskLoginComponent, MobileloginComponent, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponentview implements OnInit {
  screenSize?: string;

  constructor(private screenSizeService: ScreenSizeService, private router: Router) {}

  ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });

    // Check if the URL contains the OAuth tokens
    const hash = window.location.hash;

    if (hash) {
      // Parse the tokens from the URL hash
      const tokens = this.parseHashParams(hash);

      if (tokens.accessToken && tokens.refreshToken) {
        // Redirect to the AuthCallbackComponent with tokens as query params
        this.router.navigate(['/auth/callback'], { queryParams: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            providerToken: tokens.providerToken,
            providerRefreshToken: tokens.providerRefreshToken
          }});
      } else {
        console.error("No tokens found in URL");
      }
    }
  }

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
