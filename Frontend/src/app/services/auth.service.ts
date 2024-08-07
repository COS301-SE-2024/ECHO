import { inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from "./token.service";
import { ProviderService } from "./provider.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private tokenService: TokenService, private providerService: ProviderService) {
  }

  // This function is used to sign in the user with email and password
  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, password });
  }

  // This function is used to get the tokens from the server
  getTokens(): Observable<any> {
    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();
    return this.http.post(`${this.apiUrl}/providertokens`, {accessToken: laccessToken, refreshToken: lrefreshToken});
  }

  verifyOfflineSession(): Promise<boolean>
  {
    if (localStorage.getItem('loggedIn') === 'true')
    {
      return new Promise<boolean>((resolve) => {
              resolve(true);
      });
    }
    else
    {
      return new Promise<boolean>((resolve) => {
              resolve(false);
      });
    }
  }

  // This function is used to sign in the user with Spotify OAuth
  async signInWithOAuth(): Promise<void> {
    const providerName = this.providerService.getProviderName();
    this.http.post<{ url: string }>(`${this.apiUrl}/oauth-signin`, { provider: providerName })
      .subscribe(
        (response) => {
          if (response && response.url) {
            window.location.href = response.url;
          } else {
            console.error('No URL returned from the server');
          }
        },
        (error) => {
          console.error('OAuth signin error:', error);
        }
      );
  }

  // This function is used to sign up the user with email and password
  signUp(email: string, password: string, metadata: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password, metadata });
  }

  // This function is used to sign out the user
  signOut(): Observable<any> {
    return this.http.post(`${this.apiUrl}/signout`, {});
  }

  // This function is used to get the current user from the server
  currentUser(): Observable<any> {
    const tokens = this.tokenService.getAllTokens();
    return this.http.post(`${this.apiUrl}/current`, tokens);
  }

  // This function is used to send the tokens to the server
  sendTokensToServer(tokens: { accessToken: string | null; refreshToken: string | null; providerToken: string | null; providerRefreshToken: string | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}/token`, tokens);
  }

  // This function is used to send the code to the server
  sendCodeToServer(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/code`, { code });
  }

  // This function is used to get the current user's provider from the server
  getProvider(): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider`);
  }
}
