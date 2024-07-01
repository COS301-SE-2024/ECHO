import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";


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
export class SpotifyService {
  private player: any;
  private deviceId: string | null = null;
  private currentlyPlayingTrackSubject = new BehaviorSubject<any>(null);
  private playingStateSubject = new BehaviorSubject<boolean>(false);
  currentlyPlayingTrack$ = this.currentlyPlayingTrackSubject.asObservable();
  playingState$ = this.playingStateSubject.asObservable();
  private queueCache: { [key: string]: any } = {};
  private cacheTTL = 3600000;
  private recentlyPlayedCache: { data: any, timestamp: number } | null = null;
  private rcacheTTL = 600000;


  constructor(private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {}

  public async init(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Initializing Spotify SDK in the browser...');
      await this.initializeSpotify();
    } else {
      console.log('Spotify SDK initialization skipped on the server.');
    }
  }

  private async initializeSpotify(): Promise<void> {
    try {
      const tokens = await firstValueFrom(this.authService.getTokens());
      this.loadSpotifySdk(tokens.providerToken);
    } catch (error) {
      console.error('Error fetching Spotify token from AuthService:', error);
    }
  }

  private loadSpotifySdk(providerToken: string): void {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.initializePlayer(providerToken);
    };

    document.head.appendChild(script);
  }

  private initializePlayer(providerToken: string): void {
    this.player = new Spotify.Player({
      name: 'ECHO',
      getOAuthToken: cb => { cb(providerToken); },
      volume: 0.5
    });

    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
    });

    this.player.addListener('player_state_changed', (state: any) => {
      if (state) {
        const track = state.track_window.current_track;
        this.currentlyPlayingTrackSubject.next(track);
        this.playingStateSubject.next(!state.paused);
      }
    });

    this.player.connect();
  }

  public async playTrackById(trackId: string): Promise<void> {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before playing.');
      return;
    }

    const spotifyUri = `spotify:track:${trackId}`;

    const response = await this.http.put(`http://localhost:3000/api/spotify/play`, { trackId:trackId, deviceId: this.deviceId }).toPromise();
    await this.setCurrentlyPlayingTrack(trackId);
  }

  public pause(): void {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before pausing.');
      return;
    }

    this.player.pause().then(() => {
      console.log('Playback paused');
      this.playingStateSubject.next(false);
    });
  }

  public play(): void {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before continuing.');
      return;
    }

    this.player.getCurrentState().then((state: any) => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }

      if (state.paused) {
        this.player.resume().then(() => {
          console.log('Playback resumed');
          this.playingStateSubject.next(true);
        }).catch((error: any) => {
          console.error('Failed to resume playback', error);
        });
      } else {
        console.log('Playback is already ongoing');
      }
    }).catch((error: any) => {
      console.error('Failed to get player state', error);
    });
  }

  public setVolume(volume: number): void {
    if (this.player) {
      this.player.setVolume(volume).then(() => console.log(`Volume set to ${volume * 100}%`));
    }
  }

  public async getRecentlyPlayedTracks(provider: string | null): Promise<any> {
    const cacheKey = 'recentlyPlayed';
    const currentTime = new Date().getTime();

    // Check if data is cached and within TTL
    if (this.recentlyPlayedCache && (currentTime - this.recentlyPlayedCache.timestamp) < this.rcacheTTL) {
      return this.recentlyPlayedCache.data;
    }

    try {
      const response = await this.http.get<any>('http://localhost:3000/api/spotify/recently-played').toPromise();

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      this.recentlyPlayedCache = {
        timestamp: currentTime,
        data: response
      };

      return response;
    } catch (error) {
      console.error('Error fetching recently played tracks:', error);
      throw error;
    }
  }

  public async getQueue(provider: string | null): Promise<TrackInfo[]> {
    const recentlyPlayed = await this.getRecentlyPlayedTracks("spotify");
    if (!recentlyPlayed || recentlyPlayed.items.length === 0) {
      throw new Error('No recently played tracks found');
    }

    const mostRecentTrack = recentlyPlayed.items[0].track;
    const artist = mostRecentTrack.artists[0].name;
    const songName = mostRecentTrack.name;

    const response = await this.http.post<any>(`http://localhost:3000/api/spotify/queue`, {
      artist,
      song_name: songName
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
      console.log('Queue tracks:', tracks);
      return tracks;
    } else {
      throw new Error('Invalid response structure');
    }
  }


  public async getCurrentlyPlayingTrack(): Promise<any> {
    try {
      const response = await this.http.get<any>('http://localhost:3000/api/spotify/currently-playing').toPromise();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Error fetching currently playing track:', error);
      throw error;
    }
  }

  private setCurrentlyPlayingTrack(trackId: string): void {
    this.getTrackDetails(trackId).then(track => {
      this.currentlyPlayingTrackSubject.next(track);
    });
  }

  private async getTrackDetails(trackId: string): Promise<any> {
    try {
      const response = await this.http.post<any>('http://localhost:3000/api/spotify/track-details', {trackID: trackId}).toPromise();

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      return response;
    } catch (error) {
      console.error('Error fetching recently played tracks:', error);
      throw error;
    }
  }

  disconnectPlayer() {
    if (this.player) {
      this.player.disconnect().then(() => {
        console.log('Player disconnected');
      }).catch((error: any) => {
        console.error('Failed to disconnect player', error);
      });
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
