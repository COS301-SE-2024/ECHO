import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service'; // Make sure the path is correct
import { firstValueFrom, BehaviorSubject } from 'rxjs';

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

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Initializing Spotify SDK in the browser...');
      this.initializeSpotify();
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
      this.deviceId = device_id; // Store device ID
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

  public playTrackById(trackId: string): void {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before playing.');
      return;
    }

    const spotifyUri = `spotify:track:${trackId}`;
    const tokenRetrieval = (token: string) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotifyUri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json().catch(() => ({}));
        })
        .then(data => {
          console.log('Play response:', data);
          this.setCurrentlyPlayingTrack(trackId); // Update currently playing track
          this.playingStateSubject.next(true); // Notify that a track is playing
        })
        .catch(error => console.error('Error playing track:', error));
    };

    this.player._options.getOAuthToken(tokenRetrieval);
  }

  public pause(): void {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before pausing.');
      return;
    }

    this.player.pause().then(() => {
      console.log('Playback paused');
      this.playingStateSubject.next(false); // Notify that playback is paused
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
          this.playingStateSubject.next(true); // Notify that playback is resumed
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

  public async getRecentlyPlayedTracks(): Promise<any> {
    try {
      const tokens = await firstValueFrom(this.authService.getTokens());
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=30', {
        headers: {
          'Authorization': `Bearer ${tokens.providerToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recently played tracks:', error);
      throw error;
    }
  }

  public async getQueue(): Promise<any> {
    try {
      const tokens = await firstValueFrom(this.authService.getTokens());
      const seedArtist = '246dkjvS1zLTtiykXe5h60';
      const market = 'ES';
      const limit = 14;

      const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${seedArtist}&market=${market}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${tokens.providerToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const upNextData = data.tracks.map((track: any) => ({
        text: this.truncateText(track.name, 30), // Use the truncateText method
        secondaryText: track.artists.map((artist: any) => artist.name).join(', '),
        imageUrl: track.album.images[0]?.url || '',
        explicit: track.explicit,
        id: track.id // Add track ID for playing
      }));

      return upNextData;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  // New method to get the currently playing track
  public async getCurrentlyPlayingTrack(): Promise<any> {
    try {
      const tokens = await firstValueFrom(this.authService.getTokens());
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${tokens.providerToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching currently playing track:', error);
      throw error;
    }
  }

  // New method to set the currently playing track
  private setCurrentlyPlayingTrack(trackId: string): void {
    this.getTrackDetails(trackId).then(track => {
      this.currentlyPlayingTrackSubject.next(track);
    });
  }

  // Helper method to get track details by ID
  private async getTrackDetails(trackId: string): Promise<any> {
    try {
      const tokens = await firstValueFrom(this.authService.getTokens());
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${tokens.providerToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching track details:', error);
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

  // Helper method to truncate text
  private truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}