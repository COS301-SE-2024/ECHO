import { Injectable, Inject, PLATFORM_ID, OnDestroy } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { TokenService } from "./token.service";
import { MoodService } from "./mood-service.service";

export interface TrackInfo {
  name: string;
  artistName: string;
  albumImageUrl: string;
  id: string;
  text: string;
  albumName: string;
  imageUrl: string;
  secondaryText: string;
  previewUrl: string;
  youtubeUrl: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: typeof YT;
  }
}

@Injectable({
  providedIn: "root",
})
export class YouTubeService implements OnDestroy {
  private player!: YT.Player;
  private playerReady = false;
  private playerInitialized = false;
  private playerInitPromise: Promise<void> | null = null;
  private currentlyPlayingTrackSubject = new BehaviorSubject<any>(null);
  private playingStateSubject = new BehaviorSubject<boolean>(false);
  private playbackProgressSubject = new BehaviorSubject<number>(0);

  currentlyPlayingTrack$ = this.currentlyPlayingTrackSubject.asObservable();
  playingState$ = this.playingStateSubject.asObservable();
  playbackProgress$ = this.playbackProgressSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private tokenService: TokenService,
    private moodService: MoodService
  ) {}

  ngOnDestroy(): void {
    this.disconnectPlayer();
  }

  public async init(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      console.log("Initializing YouTube Service");

      if (!this.playerInitPromise) {
        this.playerInitPromise = new Promise<void>((resolve) => {
          if (!window.YT) {
            this.loadYouTubeAPI().then(() => {
              this.initPlayer();
              resolve();
            });
          } else {
            this.initPlayer();
            resolve();
          }
        });
      }

      await this.playerInitPromise;
      console.log("YouTube Player is initialized.");
    }
  }

  private loadYouTubeAPI(): Promise<void> {
    return new Promise<void>((resolve) => {
      const existingScript = document.getElementById("youtube-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = "youtube-api";
        tag.onload = () => {
          console.log("YouTube API script loaded successfully.");
        };
        window["onYouTubeIframeAPIReady"] = () => {
          console.log("YouTube API Ready callback invoked.");
          resolve();
        };
        document.head.appendChild(tag);
      } else {
        resolve();
      }
    });
  }

  private initPlayer(): void {
    if (!this.playerInitialized && window.YT) {
      this.player = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "",
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
        },
      });
      this.playerInitialized = true;
      console.log("YouTube player initialized.");
    } else {
      console.error("YT library not available.");
    }
  }

  private onPlayerReady(event: YT.PlayerEvent): void {
    console.log("YouTube player is ready");
    this.playerReady = true; // Set player as ready
  }

  private onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        console.log("YouTube video is playing");
        this.playingStateSubject.next(true);
        break;
      case YT.PlayerState.PAUSED:
        console.log("YouTube video is paused");
        this.playingStateSubject.next(false);
        break;
      case YT.PlayerState.ENDED:
        console.log("YouTube video ended");
        this.playingStateSubject.next(false);
        break;
    }
  }

  public async playTrackById(trackId: string): Promise<void> {
    await this.init(); // Ensure player is initialized

    if (!this.playerReady || typeof this.player.loadVideoById !== "function") {
      console.error("YouTube player is not initialized or loadVideoById is not a function.");
      return;
    }

    try {
      console.log(`Loading video with ID: ${trackId}`);
      this.player.loadVideoById(trackId); // Load and play the video by ID
      this.setCurrentlyPlayingTrack(trackId); // Update the currently playing track
    } catch (error) {
      console.error("Error playing YouTube track:", error);
    }
  }

  public pause(): void {
    if (this.player) {
      this.player.pauseVideo();
    }
  }

  public play(): void {
    if (this.player) {
      this.player.playVideo();
    }
  }

  public async seekToPosition(seconds: number): Promise<void> {
    if (this.player) {
      this.player.seekTo(seconds, true);
    }
  }

  public setVolume(volume: number): void {
    if (this.player) {
      this.player.setVolume(volume * 100);
    }
  }

  public async getQueue(query: string): Promise<TrackInfo[]> {
    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    const response = await this.http.post<any>(`http://localhost:3000/api/youtube/search`, {
      query,
      accessToken,
      refreshToken,
    }).toPromise();

    return response.map((track: any) => ({
      id: track.id,
      text: track.name,
      albumName: track.albumName,
      imageUrl: track.albumImageUrl,
      secondaryText: track.artistName,
      previewUrl: "",
      youtubeUrl: `https://www.youtube.com/watch?v=${track.id}`,
    }));
  }

  public async getCurrentlyPlayingTrack(): Promise<any> {
    if (this.player) {
      const videoData = this.player.getVideoData();
      return {
        id: videoData.video_id,
        name: videoData.title,
        artist: videoData.author,
      };
    }
    return null;
  }

  public setCurrentlyPlayingTrack(trackId: string): void {
    this.getTrackDetails(trackId).then((track) => {
      this.currentlyPlayingTrackSubject.next(track);
    });
  }

  public async getTrackDetails(trackId: string): Promise<any> {
    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    return this.http.post<any>("http://localhost:3000/api/youtube/video", {
      id: trackId,
      accessToken,
      refreshToken,
    }).toPromise();
  }

  public disconnectPlayer(): void {
    if (this.player) {
      this.player.destroy();
      this.playerInitialized = false; // Ensure it is re-initialized after logout
      this.playerReady = false; // Mark player as not ready
      console.log("YouTube player destroyed.");
    }
  }

  public async mute(): Promise<void> {
    if (this.player) {
      this.player.mute();
    }
  }

  public async unmute(): Promise<void> {
    if (this.player) {
      this.player.unMute();
    }
  }

  public getCurrentPlaybackState(): void {
    if (this.player) {
      const duration = this.player.getDuration();
      const currentTime = this.player.getCurrentTime();
      this.playbackProgressSubject.next((currentTime / duration) * 100);
    }
  }

  public async getTrackDetailsByName(trackName: string, artistName: string): Promise<TrackInfo[]> {
    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    const response = await this.http.post<any>("http://localhost:3000/api/youtube/track-details-by-name", {
      trackName,
      artistName,
      accessToken,
      refreshToken,
    }).toPromise();

    return response.map((track: any) => ({
      id: track.id,
      text: track.name,
      albumName: track.albumName,
      imageUrl: track.albumImageUrl,
      secondaryText: track.artistName,
      previewUrl: "",
      youtubeUrl: `https://www.youtube.com/watch?v=${track.id}`,
    }));
  }

  public async getTopYouTubeTracks(): Promise<any[]> {
    try {
      const response = await this.http.get<TrackInfo[]>(`http://localhost:3000/api/youtube/top-tracks`).toPromise();
      console.log("Top tracks response:", JSON.stringify(response, null, 2));

      if (Array.isArray(response)) {
        return response.map((track) => ({
          id: track.id,
          imageUrl: track.albumImageUrl,
          text: track.name,
          secondaryText: track.artistName,
          explicit: false,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching top YouTube tracks:", error);
      return [];
    }
  }

  public previousTrack(): void {
    if (this.player && typeof this.player.previousVideo === "function") {
      this.player.previousVideo();
    }
  }

  public nextTrack(): void {
    if (this.player && typeof this.player.nextVideo === "function") {
      this.player.nextVideo();
    }
  }
}
