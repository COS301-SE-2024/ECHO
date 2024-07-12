import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from "./token.service";

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
      await this.loadYouTubeIframeAPI();
      this.hasBeenInitialized = true;
    }
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

  private onPlayerReady(event: any): void {
    console.log('YouTube player is ready');
  }

  private onPlayerStateChange(event: any): void {
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

  public async playVideoById(videoId: string): Promise<void> {
    if (this.player && this.player.loadVideoById) {
      this.player.loadVideoById(videoId);
      await this.setCurrentlyPlayingTrack(videoId);
    }
  }

  public pause(): void {
    if (this.player && this.player.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  public play(): void {
    if (this.player && this.player.playVideo) {
      this.player.playVideo();
    }
  }

  public setVolume(volume: number): void {
    if (this.player && this.player.setVolume) {
      this.player.setVolume(volume * 100);
    }
  }

  public async getQueue(query: string): Promise<YouTubeTrackInfo[]> {
    const response = await this.http.post<any>(`${this.apiURL}/search`, { query }).toPromise();
    return response.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  }

  private async setCurrentlyPlayingTrack(videoId: string): Promise<void> {
    const videoDetails = await this.getVideoDetails(videoId);
    this.currentlyPlayingTrackSubject.next(videoDetails);
  }


  public disconnectPlayer(): void {
    if (this.player && this.player.destroy) {
      this.player.destroy();
    }
  }
}
