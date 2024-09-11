declare namespace YT {
  class Player {
    constructor(elementId: string, options: PlayerOptions);

    // Basic video control
    loadVideoById(videoId: string): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    nextVideo(): void;
    previousVideo(): void;

    // Video status and progress
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): PlayerState; // Added this missing method
    getVideoData(): VideoData;

    // Volume control
    setVolume(volume: number): void;
    mute(): void;
    unMute(): void;

    // Seek and navigation
    seekTo(seconds: number, allowSeekAhead: boolean): void;

    // Player actions
    destroy(): void;

    // More player state and information
    isMuted(): boolean;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    getAvailablePlaybackRates(): number[];
    getPlaybackQuality(): string;
    setPlaybackQuality(suggestedQuality: string): void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    target: Player;
    data: PlayerState;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      rel?: 0 | 1;
      showinfo?: 0 | 1;
      modestbranding?: 0 | 1;
      loop?: 0 | 1;
      playlist?: string;
      cc_load_policy?: 0 | 1;
    };
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: PlayerEvent) => void;
      onPlaybackQualityChange?: (event: PlayerEvent) => void;
      onPlaybackRateChange?: (event: PlayerEvent) => void;
    };
  }

  // Enum to represent the player state
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }

  // Video data interface
  interface VideoData {
    video_id: string;
    title: string;
    author: string;
  }
}
