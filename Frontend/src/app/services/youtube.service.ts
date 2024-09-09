import { Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { TokenService } from "./token.service";

declare global
{
  interface Window
  {
    onYouTubeIframeAPIReady: () => void;
    YT: typeof YT;
  }
}

@Injectable({
  providedIn: "root"
})
export class YouTubeService
{
  private player!: YT.Player;
  private isReady = new ReplaySubject<boolean>(1);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTrackInfoSubject = new BehaviorSubject<any>(null);

  isPlaying$ = this.isPlayingSubject.asObservable();
  currentTrackInfo$ = this.currentTrackInfoSubject.asObservable();

  private apiKey = "YOUR_YOUTUBE_API_KEY";
  private apiUrl = "https://www.googleapis.com/youtube/v3/videos";

  constructor(private http: HttpClient, private tokenService: TokenService)
  {
  }

  public async loadYouTubeAPI(): Promise<void>
  {
    if (typeof window !== "undefined" && !window["YT"])
    {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window["onYouTubeIframeAPIReady"] = () =>
      {
        this.initPlayer();
      };
    }
    else
    {
      this.initPlayer();
    }
  }

  private initPlayer(): void
  {
    this.player = new YT.Player("youtube-iframe", {
      height: "0",
      width: "0",
      events: {
        "onReady": () => this.isReady.next(true),
        "onStateChange": (event: YT.OnStateChangeEvent) => this.onPlayerStateChange(event)
      }
    });
  }

  private onPlayerStateChange(event: YT.OnStateChangeEvent): void
  {
    switch (event.data)
    {
      case YT.PlayerState.PLAYING:
        this.isPlayingSubject.next(true);
        break;
      case YT.PlayerState.PAUSED:
      case YT.PlayerState.ENDED:
        this.isPlayingSubject.next(false);
        break;
      default:
        break;
    }
  }

  async playTrackById(videoId: string): Promise<void>
  {
    this.isReady.subscribe(isReady =>
    {
      if (isReady)
      {
        this.player.loadVideoById(videoId);
        this.updateCurrentTrackInfo(videoId);
      }
    });
  }

  pause(): void
  {
    this.isReady.subscribe(isReady =>
    {
      if (isReady)
      {
        this.player.pauseVideo();
      }
    });
  }

  play(): void
  {
    this.isReady.subscribe(isReady =>
    {
      if (isReady)
      {
        this.player.playVideo();
      }
    });
  }

  stop(): void
  {
    this.isReady.subscribe(isReady =>
    {
      if (isReady)
      {
        this.player.stopVideo();
      }
    });
  }

  seekToPosition(seconds: number): void
  {
    this.isReady.subscribe(isReady =>
    {
      if (isReady)
      {
        this.player.seekTo(seconds, true);
      }
    });
  }

  async mute(): Promise<void>
  {
    this.isReady.subscribe(isReady =>
    {
      if (isReady)
      {
        this.player.mute();
      }
    });
  }

  async unmute(): Promise<void>
  {
    this.isReady.subscribe(isReady =>
    {
      if (isReady)
      {
        this.player.unMute();
      }
    });
  }

  private async updateCurrentTrackInfo(videoId: string): Promise<void>
  {
    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();

    const key = await this.http.post<any>("http://localhost:3000/api/spotify/track-details", {
      accessToken: laccessToken,
      refreshToken: lrefreshToken
    }).toPromise();

    this.http.get<any>(`${this.apiUrl}?part=snippet&id=${videoId}&key=${key}`)
      .pipe(
        map(response =>
        {
          const snippet = response.items[0].snippet;
          return {
            id: videoId,
            name: snippet.title,
            artist: snippet.channelTitle,
            album: "",
            imageUrl: snippet.thumbnails.high.url
          };
        })
      ).subscribe(trackInfo =>
    {
      this.currentTrackInfoSubject.next(trackInfo);
    });
  }

  disconnectPlayer()
  {
    this.player.destroy();
  }

  adjustVolume(newVolume: number)
  {
    this.player.setVolume(newVolume);
  }

  nextTrack()
  {
    this.player.nextVideo();
  }

  previousTrack()
  {
    this.player.previousVideo();
  }

}
