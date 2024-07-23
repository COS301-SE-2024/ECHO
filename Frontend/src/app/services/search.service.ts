import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from "./token.service";

export interface Track {
  name: string;
  albumName: string;
  albumImageUrl: string;
  artistName: string;
}

export interface TrackInfo {
  id: string;
  text: string;
  albumName: string;
  imageUrl: string;
  secondaryText: string;
  previewUrl: string;
  spotifyUrl: string;
  explicit: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  //Subjects for search results (tracks, albums, and top search)
  private searchResultSubject = new BehaviorSubject<Track[]>([]);
  private albumResultSubject = new BehaviorSubject<Track[]>([]);
  private topResultSubject = new BehaviorSubject<Track>({name: '', albumName: '', albumImageUrl: '', artistName: ''});
  //Observables for search results (tracks, albums, and top search)
  searchResult$ = this.searchResultSubject.asObservable();
  albumResult$ = this.albumResultSubject.asObservable();
  topResult$ = this.topResultSubject.asObservable();

  constructor(private httpClient: HttpClient, private tokenService: TokenService, private http: HttpClient) {}

  // Store search results in searchResultSubject and set topResultSubject
  storeSearch(query: string): Observable<Track[]> {
    return this.httpClient.post<Track[]>(`http://localhost:3000/api/search/search`, {"title": query})
      .pipe(
        tap(results => {
          this.searchResultSubject.next(results);
          console.log("search results: ", results);
          if (results.length > 0) {
            this.topResultSubject.next(results[0]);  // Update topResultSubject
          }
        })
      );
  }

 // Store album search results in albumResultSubject
  storeAlbumSearch(query: string): Observable<Track[]> {
    return this.httpClient.post<Track[]>(`http://localhost:3000/api/search/album`, {"title": query})
      .pipe(
        tap(results => {
          this.albumResultSubject.next(results);
          console.log("search results: ", results);
        })
      );
  }

  // Get search results (for individual tracks)
  getSearch(): Observable<Track[]> {
    return this.searchResult$;
  }

  // Get top search result
  getTopResult(): Observable<Track> {
    return this.topResult$;
  }

  // Get album search results (as albums)
  getAlbumSearch(): Observable<Track[]> {
    return this.albumResult$;
  }

  // Get the suggested songs based on an input song from the ECHO API
  public async echo(trackName: string, artistName: string): Promise<TrackInfo[]> {


    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();

    const response = await this.http.post<any>(`http://localhost:3000/api/spotify/queue`, {
      artist: artistName,
      song_name: trackName,
      accessToken: laccessToken,
      refreshToken: lrefreshToken
    }).toPromise();


    // Map the tracks array in the response
    if (response && Array.isArray(response.tracks)) {
      const tracks = response.tracks.map((track: any) => ({
        id: track.id,
        text: track.name,
        albumName: track.album.name,
        imageUrl: track.album.images[0]?.url,
        secondaryText: track.artists[0]?.name,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        explicit: track.explicit
      } as TrackInfo));

      return tracks;
    } else {
      throw new Error('Invalid response structure');
    }
  }


}
