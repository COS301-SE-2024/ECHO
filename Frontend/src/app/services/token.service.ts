import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  //The constructor checks whether the tokens were stored in session Storage to persist the user's session.
  constructor() {
    this.initializeFromStorage();
  }

  //This method initializes the tokens from session Storage.
  private initializeFromStorage(): void {
    if (typeof sessionStorage === 'undefined') return;

    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    if (accessToken) this.accessTokenSubject.next(accessToken);
    if (refreshToken) this.refreshTokenSubject.next(refreshToken);
  }

  //This method sets the access token and refresh token in the BehaviorSubjects and session Storage.
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    this.accessTokenSubject.next(accessToken);
    this.refreshTokenSubject.next(refreshToken);
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  //This method returns the access token.
  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  //This method returns the refresh token.
  getRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  //This method returns the access token and refresh token.
  getAllTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: this.accessTokenSubject.value,
      refreshToken: this.refreshTokenSubject.value
    };
  }

  //This method clears the access token and refresh token from the BehaviorSubjects and session Storage.
  clearTokens(): void {
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);

    if (typeof sessionStorage === 'undefined') return;

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }

  //This method returns the access token as an Observable.
  getAccessToken$(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }
}
