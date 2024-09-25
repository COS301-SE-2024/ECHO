import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { TokenService } from "./token.service";
import { ProviderService } from "./provider.service";
import { Router } from "@angular/router";
import { PlayerStateService } from "./player-state.service";
import { environment } from '../../environments/environment';




export interface AuthResponse
{
  user: any,
  session: any
}

@Injectable({
  providedIn: "root"
})
export class AuthService
{
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private tokenService: TokenService, private playerStateService: PlayerStateService, private providerService: ProviderService, private router: Router)
  {
  }

  // This function is used to sign in the user with email and password
  signIn(email: string, password: string): Observable<any>
  {
    if (localStorage.getItem("loggedIn") === "true")
    {
      this.router.navigate(["/home"]);
      this.loggedInSubject.next(true);
    }
    else
    {
      localStorage.setItem("loggedIn", "true");
      this.loggedInSubject.next(true);
    }
    this.http.post(`${this.apiUrl}/signin`, { email, password })
      .subscribe(
(response: any) =>
        {
          this.loggedInSubject.next(true);
          localStorage.setItem("loggedIn", "true");
          this.tokenService.setTokens(response.session.access_token, response.session.refresh_token);
          return this.router.navigate(["/home"]);
        },
        (error) =>
        {
          console.error("Sign in error:", error);
          return this.router.navigate(["/login"]);
        }
      );
    return new Observable();
  }

  // This function is used to get the tokens from the server
  getTokens(): Observable<any>
  {
    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();
    return this.http.post(`${this.apiUrl}/providertokens`, { accessToken: laccessToken, refreshToken: lrefreshToken });
  }

  async setProviderTokens(laccessToken: string, lrefreshToken: string): Promise<void>
  {

    await this.http.post(`${this.apiUrl}/providertokens`, { accessToken: laccessToken, refreshToken: lrefreshToken });
  }


  verifyOfflineSession(): Promise<boolean>
  {
    if (localStorage.getItem("loggedIn") === "true")
    {
      return new Promise<boolean>((resolve) =>
      {
        resolve(true);
      });
    }
    else
    {
      return new Promise<boolean>((resolve) =>
      {
        resolve(false);
      });
    }
  }

  // This function is used to sign in the user with Spotify OAuth
  async signInWithOAuth(): Promise<void>
  {
    localStorage.removeItem("loggedIn");
    this.tokenService.clearTokens();  // Make sure to clear any tokens stored for the previous user

    this.loggedInSubject.next(false);

    const providerName = this.providerService.getProviderName();
    this.http.post<{ url: string }>(`${this.apiUrl}/oauth-signin`, { provider: providerName })
      .subscribe(
        async (response) =>
        {
          this.loggedInSubject.next(true);
          if (this.providerService.getProviderName() === "spotify")
          {
            if (typeof localStorage !== "undefined")
            {
              localStorage.setItem("spotifyReady", "true");
            }
          }
          await this.playerStateService
          if (response && response.url)
          {
            localStorage.setItem("loggedIn", "true");
            window.location.href = response.url;
          }
          else
          {
            console.error("No URL returned from the server");
          }
        },
        (error) =>
        {
          console.error("OAuth signin error:", error);
        }
      );
  }

  // This function is used to check if the provider used is ready to load content
  async isReady()
  {
    return localStorage.getItem("ready") === "true";
  }

  async setReady()
  {
    localStorage.setItem("ready", "true");
  }

  // This function is used to sign up the user with email and password
  signUp(email: string, password: string, metadata: any): Observable<any>
  {
    localStorage.setItem("loggedIn", "true");
    return this.http.post(`${this.apiUrl}/signup`, { email, password, metadata });
  }

  // This function is used to sign out the user
  signOut(): Observable<any>
  {
    this.loggedInSubject.next(false);
    return this.http.post(`${this.apiUrl}/signout`, {});
  }

  // This function is used to get the current user from the server
  currentUser(): Observable<any>
  {
    const tokens = this.tokenService.getAllTokens();
    return this.http.post(`${this.apiUrl}/current`, tokens);
  }

  // This function is used to send the tokens to the server
  sendTokensToServer(tokens: {
    accessToken: string | null;
    refreshToken: string | null;
    providerToken: string | null;
    providerRefreshToken: string | null
  }): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/token`, tokens);
  }

  // This function is used to send the code to the server
  sendCodeToServer(code: string): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/code`, { code });
  }

  // This function is used to get the current user's provider from the server
  getProvider(): Observable<any>
  {
    return this.http.get(`${this.apiUrl}/provider`);
  }

  spotifyReady()
  {
    if (typeof localStorage !== "undefined")
    {
      return localStorage.getItem("spotifyReady") === "true";
    }
    return false;
  }
}
