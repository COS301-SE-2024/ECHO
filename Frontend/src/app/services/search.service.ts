import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { TokenService } from "./token.service";

export interface Track
{
  name: string;
  albumName: string;
  albumImageUrl: string;
  artistName: string;
}

export interface TrackInfo
{
  id: string;
  text: string;
  albumName: string;
  imageUrl: string;
  secondaryText: string;
  previewUrl: string;
  spotifyUrl: string;
  explicit: boolean;
}

export interface AlbumTrack
{
  id: string;
  name: string;
  albumName: string;
  imageUrl: string;
  artist: string;
}

export interface Artist
{
  name: string;
  image: string;
  topTracks: Track[];
  albums: AlbumTrack[];
}


@Injectable({
  providedIn: "root"
})
export class SearchService
{
  //Subjects for search results (tracks, albums, and top search)
  private searchResultSubject = new BehaviorSubject<Track[]>([]);
  private albumResultSubject = new BehaviorSubject<Track[]>([]);
  private topResultSubject = new BehaviorSubject<Track>({ name: "", albumName: "", albumImageUrl: "", artistName: "" });
  //Observables for search results (tracks, albums, and top search)
  searchResult$ = this.searchResultSubject.asObservable();
  albumResult$ = this.albumResultSubject.asObservable();
  topResult$ = this.topResultSubject.asObservable();

  constructor(private httpClient: HttpClient, private tokenService: TokenService, private http: HttpClient)
  {
  }

  // Store search results in searchResultSubject and set topResultSubject
  storeSearch(query: string): Observable<Track[]>
  {
    return this.httpClient.post<Track[]>(`http://localhost:3000/api/search/search`, { "title": query })
      .pipe(
        tap(results =>
        {
          this.searchResultSubject.next(results);
          if (results.length > 0)
          {
            this.topResultSubject.next(results[0]);  // Update topResultSubject
          }
        })
      );
  }

  // Store album search results in albumResultSubject
  storeAlbumSearch(query: string): Observable<Track[]>
  {
    return this.httpClient.post<Track[]>(`http://localhost:3000/api/search/album`, { "title": query })
      .pipe(
        tap(results =>
        {
          this.albumResultSubject.next(results);
        })
      );
  }

  // Get search results (for individual tracks)
  getSearch(): Observable<Track[]>
  {
    return this.searchResult$;
  }

  // Get top search result
  getTopResult(): Observable<Track>
  {
    return this.topResult$;
  }

  // Get album search results (as albums)
  getAlbumSearch(): Observable<Track[]>
  {
    return this.albumResult$;
  }

  // Get the suggested songs based on an input song from the ECHO API
  public async echo(trackName: string, artistName: string): Promise<TrackInfo[]>
  {


    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();

    const response = await this.http.post<any>(`http://localhost:3000/api/spotify/queue`, {
      artist: artistName,
      song_name: trackName,
      accessToken: laccessToken,
      refreshToken: lrefreshToken
    }).toPromise();


    if (response && Array.isArray(response.tracks))
    {
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
    }
    else
    {
      throw new Error("Invalid response structure");
    }
  }

  // Get the tracks of a specific album
  public async getAlbumInfo(albumName: string): Promise<AlbumTrack[]>
  {
    const response = await this.http.post<any>(`http://localhost:3000/api/search/album-info`, {
      title: albumName
    }).toPromise();

    if (response && Array.isArray(response.tracks))
    {
      const albumName = response.name;
      const albumImageUrl = response.imageUrl;
      const artistName = response.artistName;
      const tracks = response.tracks.map((track: any) => ({
        id: track.id,
        name: track.name,
        albumName: albumName,
        imageUrl: albumImageUrl,
        artist: artistName
      } as AlbumTrack));

      return tracks;
    }
    else
    {
      throw new Error("Invalid response structure when searching for an album");
    }
  }

  //This function gets the details of a specific artist
  public async getArtistInfo(artistName: string): Promise<Artist[]>
  {
    const response = await this.http.post<any>(`http://localhost:3000/api/search/album-info`, {
      artist: artistName
    }).toPromise();

    if (response && Array.isArray(response.albums))
    {
      const artistName = response.name;
      const artistImage = response.image;
      const topTracks = response.topTracks.map((track: any) => ({
        name: track.name,
        albumName: track.albumName,
        albumImageUrl: track.albumImageUrl,
        artistName: track.artistName
      } as Track));
      const albums = response.albums.map((album: any) => ({
        id: album.id,
        name: album.name,
        imageUrl: album.imageUrl,
        artist: album.artist
      } as AlbumTrack));
      return [{ name: artistName, image: artistImage, topTracks: topTracks, albums: albums }];
    }
    else
    {
      throw new Error("Invalid response structure when searching for an artist");
    }
  }


}
