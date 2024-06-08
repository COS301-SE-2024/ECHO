declare namespace Spotify {
  interface PlayerInit {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume?: number;
  }

  class Player {
    constructor(options: PlayerInit);
    connect(): Promise<boolean>;
    addListener(event: string, callback: (args: any) => void): void;
  }
}
