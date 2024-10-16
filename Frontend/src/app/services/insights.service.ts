import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { TokenService } from "./token.service";
import { ProviderService } from "./provider.service";
import { environment } from "../../environments/environment";
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class InsightsService {
  private apiUrl = `${environment.apiUrl}/insights`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private providerService: ProviderService
  ) {}

  private getParams(): Observable<HttpParams> {
    return this.tokenService.getAccessToken$().pipe(
      switchMap(accessToken => {
        if (!accessToken) {
          throw new Error('No access token available');
        }
        const providerName = this.providerService.getProviderName();
        // Note: You'll need to implement a way to get the provider token
        // This is just a placeholder. Replace with your actual implementation.
        const providerToken = this.getProviderToken(providerName);
        if (!providerToken) {
          throw new Error(`No provider token available for ${providerName}`);
        }
        return of(new HttpParams({
          fromObject: {
            accessToken,
            providerToken,
            providerName
          }
        }));
      })
    );
  }

  // Placeholder method. Implement this based on how you're storing provider tokens.
  private getProviderToken(providerName: string): string | null {
    // This is just an example. Replace with your actual implementation.
    return localStorage.getItem(`${providerName}Token`);
  }

  private makeRequest(endpoint: string): Observable<any> {
    return this.getParams().pipe(
      switchMap(params => this.http.get(`${this.apiUrl}/${endpoint}`, { params })),
      catchError(error => {
        console.error(`Error fetching ${endpoint}:`, error);
        return of(null);
      })
    );
  }

  getTopMood(): Observable<any> {
    return this.makeRequest('top-mood');
  }

  getTotalListeningTime(): Observable<any> {
    return this.makeRequest('total-listening-time');
  }

  getMostListenedArtist(): Observable<any> {
    return this.makeRequest('most-listened-artist');
  }

  getMostPlayedTrack(): Observable<any> {
    return this.makeRequest('most-played-track');
  }

  getTopGenre(): Observable<any> {
    return this.makeRequest('top-genre');
  }

  getAverageSongDuration(): Observable<any> {
    return this.makeRequest('average-song-duration');
  }

  getMostActiveDay(): Observable<any> {
    return this.makeRequest('most-active-day');
  }

  getUniqueArtistsListened(): Observable<any> {
    return this.makeRequest('unique-artists-listened');
  }
}
