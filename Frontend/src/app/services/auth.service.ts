import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, password });
  }

  getTokens(): Observable<any> {
    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();
    return this.http.post(`${this.apiUrl}/providertokens`, {accessToken: laccessToken, refreshToken: lrefreshToken});
  }

  signInWithSpotifyOAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/oauth-signin`);
  }

  signUp(email: string, password: string, metadata: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password, metadata });
  }

  signOut(): Observable<any> {
    return this.http.post(`${this.apiUrl}/signout`, {});
  }

  currentUser(): Observable<any> {
    const tokens = this.tokenService.getAllTokens();
    return this.http.post(`${this.apiUrl}/current`, tokens);
  }

  sendTokensToServer(tokens: { accessToken: string | null; refreshToken: string | null; providerToken: string | null; providerRefreshToken: string | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}/token`, tokens);
  }

  sendCodeToServer(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/code`, { code });
  }

  getProvider(): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider`);
  }
}
