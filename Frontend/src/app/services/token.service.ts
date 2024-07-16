import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    if (typeof sessionStorage === 'undefined') return;

    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    if (accessToken) this.accessTokenSubject.next(accessToken);
    if (refreshToken) this.refreshTokenSubject.next(refreshToken);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessTokenSubject.next(accessToken);
    this.refreshTokenSubject.next(refreshToken);
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  getRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  getAllTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: this.accessTokenSubject.value,
      refreshToken: this.refreshTokenSubject.value
    };
  }

  clearTokens(): void {
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);

    if (typeof sessionStorage === 'undefined') return;

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }

  getAccessToken$(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }
}
