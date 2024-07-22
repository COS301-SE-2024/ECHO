import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Track {
  name: string;
  albumName: string;
  albumImageUrl: string;
  artistName: string;
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

  constructor(private httpClient: HttpClient) {}

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
}
