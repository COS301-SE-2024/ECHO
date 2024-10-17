import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { TokenService } from "./token.service";
import { ProviderService } from "./provider.service";
import { environment } from "../../environments/environment";
import { catchError, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class InsightsService {
  private apiUrl = `${environment.apiUrl}/insights`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private providerService: ProviderService
  ) {}

  private getParams(): Observable<{ accessToken: string; refreshToken: string; providerName: string }> {
    return this.tokenService.getAccessToken$().pipe(
      switchMap((accessToken) => {
        if (!accessToken) {
          return throwError(() => new Error("No access token available"));
        }

        const refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken) {
          return throwError(() => new Error("No refresh token available"));
        }

        const providerName = this.providerService.getProviderName();

        return of({ accessToken, refreshToken, providerName });
      }),
      catchError((error) => {
        console.error("Error getting parameters:", error);
        return throwError(() => error);
      })
    );
  }

  private makeRequest(endpoint: string): Observable<any> {
    return this.getParams().pipe(
      switchMap(({ accessToken, refreshToken, providerName }) =>
        this.http.post(`${this.apiUrl}/${endpoint}`, {
          accessToken,
          refreshToken,
          providerName,
        })
      ),
      catchError((error) => {
        console.error(`Error fetching ${endpoint}:`, error);
        return of(null);
      })
    );
  }

  getTopMood(): Observable<any> {
    return this.makeRequest("top-mood");
  }

  getTotalListeningTime(): Observable<any> {
    return this.makeRequest("total-listening-time");
  }

  getMostListenedArtist(): Observable<any> {
    return this.makeRequest("most-listened-artist");
  }

  getMostPlayedTrack(): Observable<any> {
    return this.makeRequest("most-played-track");
  }

  getTopGenre(): Observable<any> {
    return this.makeRequest("top-genre");
  }

  getAverageSongDuration(): Observable<any> {
    return this.makeRequest("average-song-duration");
  }

  getMostActiveDay(): Observable<any> {
    return this.makeRequest("most-active-day");
  }

  getUniqueArtistsListened(): Observable<any> {
    return this.makeRequest("unique-artists-listened");
  }
}
