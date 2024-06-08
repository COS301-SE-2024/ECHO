import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, password });
  }

  getTokens(): Observable<any> {
    return this.http.get(`${this.apiUrl}/providertokens`);
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
    return this.http.get(`${this.apiUrl}/current`);
  }

  sendTokensToServer(tokens: { accessToken: string | null; refreshToken: string | null; providerToken: string | null; providerRefreshToken: string | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}/token`, tokens);
  }
}
