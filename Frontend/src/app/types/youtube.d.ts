declare namespace YT {

    class Player {
      constructor(elementId: string, options: PlayerOptions);
      loadVideoById(videoId: string): void;
      getCurrentTime(): number;
      getDuration(): number;
      pauseVideo(): void;
      playVideo(): void;
      setVolume(volume: number): void;
      getVideoData(): any;
      destroy(): void;
    }
  interface Player {
    loadVideoById(videoId: string): void;
    getCurrentTime(): number;
    getDuration(): number;
    pauseVideo(): void;
    playVideo(): void;
    setVolume(volume: number): void;
    getVideoData(): any;
    destroy(): void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    data: number;
  }

  enum PlayerState {
    PLAYING = 1,
    PAUSED = 2,
    ENDED = 0
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
    };
  }

  function Player(elementId: string, options: PlayerOptions): Player;
}
