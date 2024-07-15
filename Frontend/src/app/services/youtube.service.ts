import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from "./token.service";
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: typeof YT;
  }
}

export interface YouTubeTrackInfo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  videoUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class YouTubeService {
  private player: any;
  private deviceId: string | null = null;
  private currentlyPlayingTrackSubject = new BehaviorSubject<YouTubeTrackInfo | null>(null);
  private playingStateSubject = new BehaviorSubject<boolean>(false);
  private playbackProgressSubject = new BehaviorSubject<number>(0);

  currentlyPlayingTrack$: Observable<YouTubeTrackInfo | null> = this.currentlyPlayingTrackSubject.asObservable();
  playingState$: Observable<boolean> = this.playingStateSubject.asObservable();
  playbackProgress$: Observable<number> = this.playbackProgressSubject.asObservable();

  private hasBeenInitialized = false;
  private readonly apiURL = 'http://localhost:3000/api/youtube';

  constructor(
    private platformId: Object,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.platformId = PLATFORM_ID;
  }

  public async init(): Promise<void> {
    if (isPlatformBrowser(this.platformId) && !this.hasBeenInitialized) {
      await this.initializeYouTube();
      this.hasBeenInitialized = true;
    }
  }

  private async initializeYouTube(): Promise<void> {
    await this.loadYouTubeIframeAPI();
  }

  private loadYouTubeIframeAPI(): Promise<void> {
    return new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window['onYouTubeIframeAPIReady'] = () => {
        this.initializePlayer();
        resolve();
      };
    });
  }

  private initializePlayer(): void {
    this.player = new YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: '',
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  }

  private onPlayerReady(event: YT.PlayerEvent): void {
    console.log('YouTube player is ready');
    this.deviceId = 'youtube-player';
  }

  private onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.playingStateSubject.next(true);
        break;
      case YT.PlayerState.PAUSED:
        this.playingStateSubject.next(false);
        break;
      case YT.PlayerState.ENDED:
        this.playingStateSubject.next(false);
        break;
    }

    this.updatePlaybackProgress();
  }

  private updatePlaybackProgress(): void {
    if (this.player && this.player.getCurrentTime && this.player.getDuration) {
      const progress = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
      this.playbackProgressSubject.next(progress);
    }
  }

  public async playTrackById(trackId: string): Promise<void> {
    if (!this.deviceId) {
      console.error('Device ID is undefined. Ensure the player is ready before playing.');
      return;
    }

    await this.player.loadVideoById(trackId);
    await this.setCurrentlyPlayingTrack(trackId);
    this.playingStateSubject.next(true);
  }

  public pause(): void {
    if (this.player && this.player.pauseVideo) {
      this.player.pauseVideo();
      this.playingStateSubject.next(false);
    }
  }

  public play(): void {
    if (this.player && this.player.playVideo) {
      this.player.playVideo();
      this.playingStateSubject.next(true);
    }
  }

  public setVolume(volume: number): void {
    if (this.player && this.player.setVolume) {
      this.player.setVolume(volume * 100);
    }
  }

  public async getRecentlyPlayedTracks(): Promise<any> {
    return [];
  }

  public async getQueue(artist: string, songName: string): Promise<YouTubeTrackInfo[]> {
    const query = `${artist} ${songName}`;
    const response = await this.http.post<any>(`${this.apiURL}/queue`, { query }).toPromise();

    return response.tracks.map((track: any) => ({
      id: track.id,
      title: track.snippet.title,
      thumbnailUrl: track.snippet.thumbnails.default.url,
      channelTitle: track.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${track.id}`
    }));
  }

  public async getCurrentlyPlayingTrack(): Promise<YouTubeTrackInfo | null> {
    if (this.player && this.player.getVideoData) {
      const videoData = this.player.getVideoData();
      return {
        id: videoData.video_id,
        title: videoData.title,
        thumbnailUrl: `https://img.youtube.com/vi/${videoData.video_id}/default.jpg`,
        channelTitle: videoData.author,
        videoUrl: `https://www.youtube.com/watch?v=${videoData.video_id}`
      };
    }
    return null;
  }

  private async setCurrentlyPlayingTrack(videoId: string): Promise<void> {
    const videoDetails = await this.getTrackDetails(videoId);
    this.currentlyPlayingTrackSubject.next(videoDetails);
  }

  private async getTrackDetails(videoId: string): Promise<YouTubeTrackInfo> {
    const response = await this.http.post<any>(`${this.apiURL}/track-details`, { videoId }).toPromise();
    return {
      id: response.id,
      title: response.snippet.title,
      thumbnailUrl: response.snippet.thumbnails.default.url,
      channelTitle: response.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${response.id}`
    };
  }

  public disconnectPlayer(): void {
    if (this.player && this.player.destroy) {
      this.player.destroy();
    }
  }

  public getCurrentPlaybackState(): void {
    if (this.player && this.player.getCurrentTime && this.player.getDuration) {
      const progress = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
      this.playbackProgressSubject.next(progress);
    }
  }
}
