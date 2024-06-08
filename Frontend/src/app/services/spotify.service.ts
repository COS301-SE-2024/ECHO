import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service'; // Make sure the path is correct
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private player: any; // Ideally, use Spotify.Player type if available from types or define your own.
  private deviceId: string | null = null; // Store the device ID when available

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
      volume: 1
    });

    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id; // Store device ID
    });

    this.player.connect();
  }

  public playTrack(): void {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before playing.');
      return;
    }

    const spotifyUri = 'spotify:track:5mVfq3wn79JVdHQ7ZuLSCB'; // URI for "Shape of You" by Ed Sheeran
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
            // Handle non-2xx HTTP responses
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // Only parse the response if it's expected to have a JSON body
          return response.json().catch(() => ({})); // Handle empty response gracefully
        })
        .then(data => console.log('Play response:', data))
        .catch(error => console.error('Error playing track:', error));
    };

    this.player._options.getOAuthToken(tokenRetrieval);
  }

  public pause(): void {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before pausing.');
      return;
    }

    this.player.pause().then(() => console.log('Playback paused'));
  }
}
