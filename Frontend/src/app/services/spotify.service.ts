import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private hasSdkLoaded = false;

  constructor() { }

  loadSpotifySdk(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.hasSdkLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;

      script.onload = () => {
        this.hasSdkLoaded = true;
        window['onSpotifyWebPlaybackSDKReady'] = () => {
          this.initializePlayer(token);
        };
        resolve();
      };

      script.onerror = (err) => reject(new Error('Spotify SDK script failed to load'));

      document.head.appendChild(script);
    });
  }

  private initializePlayer(token: string): void {
    const player = new Spotify.Player({
      name: 'Angular Spotify Web Playback',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    player.connect().then((success: any) => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
      }
    });

  }
}
