import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  //Behaviour subjects for storing the access and refresh tokens
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  //Method to set the access and refresh tokens
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessTokenSubject.next(accessToken);
    this.refreshTokenSubject.next(refreshToken);
  }

  //Method to get the access token
  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  //Method to get the refresh token
  getRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  //Method to get all tokens
  getAllTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: this.accessTokenSubject.value,
      refreshToken: this.refreshTokenSubject.value
    };

  }

  //Method to clear the tokens
  clearTokens(): void {
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
  }

  //Method to get the access token as an observable
  getAccessToken$(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }
}
