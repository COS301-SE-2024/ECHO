import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AuthService } from "./auth.service";
import { firstValueFrom, BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "./token.service";
import { ProviderService } from "./provider.service";
import { MoodService } from "./mood-service.service";
import { PlayerStateService } from "./player-state.service";
import { environment } from "../../environments/environment";

export interface TrackInfo
{
  id: string;
  text: string;
  albumName: string;
  imageUrl: string;
  secondaryText: string;
  previewUrl: string;
  spotifyUrl: string;
  explicit: boolean;
}

export interface ArtistInfo
{
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
}

export interface TrackAnalysis
{
  valence: number;
  energy: number;
  danceability: number;
  tempo: number;
}

@Injectable({
  providedIn: "root"
})
export class SpotifyService
{
  private player: any;
  private deviceId: string | null = null;
  private currentlyPlayingTrackSubject = new BehaviorSubject<any>(null);
  private playingStateSubject = new BehaviorSubject<boolean>(false);
  private playbackProgressSubject = new BehaviorSubject<number>(0);
  currentlyPlayingTrack$ = this.currentlyPlayingTrackSubject.asObservable();
  playingState$ = this.playingStateSubject.asObservable();
  playbackProgress$ = this.playbackProgressSubject.asObservable();
  private queueCache: { [key: string]: any } = {};
  private cacheTTL = 3600000;
  private recentlyPlayedCache: { data: any, timestamp: number } | null = null;
  private rcacheTTL = 600000;
  private hasBeenInitialized = false;
  private RecentListeningObject: any = null;
  private QueueObject: any = null;

  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private tokenService: TokenService,
    private providerService: ProviderService,
    private moodService: MoodService,
    private playerStateService: PlayerStateService
  )
  {
  }

  // Initialize the Player
  public async init(): Promise<void>
  {
    if (isPlatformBrowser(this.platformId) && !this.hasBeenInitialized)
    {
      await this.initializeSpotify();
      this.hasBeenInitialized = true;
    }
  }

  // Initialize the Spotify Web Playback SDK
  public async initializeSpotify(): Promise<void>
  {
    try
    {
      const tokens = await firstValueFrom(this.authService.getTokens());
      this.loadSpotifySdk(tokens.providerToken);
    }
    catch (error)
    {
      console.error("Error fetching Spotify token from AuthService:", error);
    }
  }

  public recentListeningCached(): boolean
  {
    if (sessionStorage.getItem("recentListening") !== null && sessionStorage.getItem("recentListening") !== "{}")
    {
      this.RecentListeningObject = JSON.parse(sessionStorage.getItem("recentListening") || "{}");
      return true;
    }
    return false;
  }

  public queueCached(): boolean
  {
    if (sessionStorage.getItem("queue") !== null && sessionStorage.getItem("queue") !== "{}")
    {
      this.QueueObject = JSON.parse(sessionStorage.getItem("queue") || "{}");
      return true;
    }
    return false;
  }

  // Load the Spotify Web Playback SDK script
  public loadSpotifySdk(providerToken: string): void
  {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () =>
    {
      this.initializePlayer(providerToken);
    };

    document.head.appendChild(script);
  }

  // Initialize the Spotify Web Playback player
  public async initializePlayer(providerToken: string): Promise<void>
  {
    this.player = new Spotify.Player({
      name: "ECHO",
      getOAuthToken: cb =>
      {
        cb(providerToken);
      },
      volume: 0.5
    });

    this.player.addListener("ready", ({ device_id }: { device_id: string }) =>
    {
      this.deviceId = device_id;
    });

    this.player.addListener("player_state_changed", (state: any) =>
    {
      if (state)
      {
        const track = state.track_window.current_track;
        this.currentlyPlayingTrackSubject.next(track);
        this.playingStateSubject.next(!state.paused);

        const progress = (state.position / state.duration) * 100;
        this.playbackProgressSubject.next(progress);
      }
    });

    this.player.connect();
    await this.authService.setReady();
    await this.playerStateService.setReady();
  }

  // Method to get the progress of the currently playing track
  public getCurrentPlaybackState(): void
  {
    if (this.player)
    {
      this.player.getCurrentState().then((state: any) =>
      {
        if (state)
        {
          const progress = (state.position / state.duration) * 100;
          this.playbackProgressSubject.next(progress);
        }
      });
    }
  }

  // Play a track by its Spotify ID
  public async playTrackById(trackId: string): Promise<void>
  {
    if (!this.deviceId)
    {
      console.error("Device ID is undefined. Ensure the player is ready before playing.");
      return;
    }

    const spotifyUri = `spotify:track:${trackId}`;

    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();

    const response = await this.http.put(`${this.apiUrl}/spotify/play`, {
      trackId: trackId,
      deviceId: this.deviceId,
      accessToken: laccessToken,
      refreshToken: lrefreshToken
    }).toPromise();
    await this.setCurrentlyPlayingTrack(trackId);
    this.moodService.setCurrentMood(await this.getTrackMood(trackId));
  }

  // Pause the currently playing track
  public pause(): void
  {
    if (!this.deviceId)
    {
      console.error("Device ID is undefined. Ensure the player is ready before pausing.");
      return;
    }

    this.player.pause().then(() =>
    {
      this.playingStateSubject.next(false);
    });
  }

  //This function plays the next track on the current device
  public async playNextTrack(): Promise<void>
  {
    if (!this.deviceId)
    {
      console.error("Device ID is undefined. Ensure the player is ready before continuing.");
      return;
    }

    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();

    try
    {
      await this.http.put(`${this.apiUrl}/spotify/next-track`, {
        deviceId: this.deviceId,
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      await new Promise(resolve => setTimeout(resolve, 200));

      const currentTrack = await this.getCurrentlyPlayingTrack();
      if (currentTrack && currentTrack.item)
      {
        await this.setCurrentlyPlayingTrack(currentTrack.item.id);
      }
    }
    catch (error)
    {
      console.error("Error playing next track:", error);
    }
  }

  //This function plays the next track on the current device
  public async playPreviousTrack(): Promise<void>
  {
    if (!this.deviceId)
    {
      console.error("Device ID is undefined. Ensure the player is ready before continuing.");
      return;
    }

    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();

    try
    {
      await this.http.put(`${this.apiUrl}/spotify/previous-track`, {
        deviceId: this.deviceId,
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      await new Promise(resolve => setTimeout(resolve, 200));

      const currentTrack = await this.getCurrentlyPlayingTrack();
      if (currentTrack && currentTrack.item)
      {
        await this.setCurrentlyPlayingTrack(currentTrack.item.id);
      }
    }
    catch (error)
    {
      console.error("Error playing previous track:", error);
    }
  }

  // This function seeks to a specific position in the current track
  public async seekToPosition(progress: number): Promise<void>
  {
    if (!this.deviceId)
    {
      console.error("Device ID is undefined. Ensure the player is ready before continuing.");
      return;
    }

    try
    {
      const state = await this.player.getCurrentState();

      if (!state) {
        console.error("No track is currently playing.");
        return;
      }

      const trackDuration = state.track_window.current_track.duration_ms;
      const seekPosition = (progress / 100) * trackDuration;

      this.player.seek(seekPosition);
    }
    catch (error)
    {
      console.error("Error seeking to position:", error);
    }
  }


  // Resume playback
  public play(): void
  {
    if (!this.deviceId)
    {
      console.error("Device ID is undefined. Ensure the player is ready before continuing.");
      return;
    }

    this.player.getCurrentState().then((state: any) =>
    {
      if (!state)
      {
        console.error("User is not playing music through the Web Playback SDK");
        return;
      }

      if (state.paused)
      {
        this.player.resume().then(() =>
        {
          this.playingStateSubject.next(true);
        }).catch((error: any) =>
        {
          console.error("Failed to resume playback", error);
        });
      }
    }).catch((error: any) =>
    {
      console.error("Failed to get player state", error);
    });
  }

  // Set the volume of the player
  public setVolume(volume: number): void
  {
    if (this.player)
    {
      this.player.setVolume(volume);
    }
  }

  // Get the user's recent listening from Spotify
  public async getRecentlyPlayedTracks(provider: string | null): Promise<any>
  {
    if (this.recentListeningCached())
    {
      return Promise.resolve(this.RecentListeningObject);
    }

    const cacheKey = "recentlyPlayed";
    const currentTime = new Date().getTime();

    // Check if data is cached and within TTL
    if (this.recentlyPlayedCache && (currentTime - this.recentlyPlayedCache.timestamp) < this.rcacheTTL)
    {
      return this.recentlyPlayedCache.data;
    }

    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<any>(`${this.apiUrl}/spotify/recently-played`, {
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      if (!response)
      {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      this.recentlyPlayedCache = {
        timestamp: currentTime,
        data: response
      };

      sessionStorage.setItem("recentListening", JSON.stringify(response));
      this.RecentListeningObject = response;
      console.error(response);
      return response;
    }
    catch (error)
    {
      console.error("Error fetching recently played tracks:", error);
      throw error;
    }
  }

  // Check if the queue has been created
  private queueCreated(): boolean
  {
    return localStorage.getItem("queueCreated") === "true";
  }

  // Set the queue as created
  private setQueueCreated(): void
  {
    localStorage.setItem("queueCreated", "true");
  }

  // Get the suggested tracks for the user from the ECHO API
  public async getQueue(provider: string | null): Promise<TrackInfo[]>
  {
    if (this.queueCached())
    {
      return Promise.resolve(this.QueueObject);
    }

    const recentlyPlayed = await this.getRecentlyPlayedTracks("spotify");
    if (!recentlyPlayed || recentlyPlayed.items.length === 0)
    {
      throw new Error("No recently played tracks found");
    }

    const mostRecentTrack = recentlyPlayed.items[0].track;
    const artist = mostRecentTrack.artists[0].name;
    const songName = mostRecentTrack.name;

    const laccessToken = this.tokenService.getAccessToken();
    const lrefreshToken = this.tokenService.getRefreshToken();

    const response = await this.http.post<any>(`${this.apiUrl}/spotify/queue`, {
      artist,
      song_name: songName,
      accessToken: laccessToken,
      refreshToken: lrefreshToken
    }).toPromise();
    // Map the tracks array in the response
    if (response && Array.isArray(response.tracks))
    {
      let count: number = 0;
      const tracks = response.tracks.map((track: any) =>
      {
        if (this.player)
        {
          if (count < 5 && !this.queueCreated())
          {
            this.addTrackToQueue(track.id);
            ++count;
          }
          else if (count >= 5)
          {
            this.setQueueCreated();
          }
        }
        console.error('Here');
        return {
          id: track.id,
          text: track.name,
          albumName: track.album.name,
          imageUrl: track.album.images[0]?.url,
          secondaryText: track.artists[0]?.name,
          previewUrl: track.preview_url,
          spotifyUrl: track.external_urls.spotify,
          explicit: track.explicit
        } as TrackInfo;
      });

      sessionStorage.setItem("queue", JSON.stringify(tracks));
      this.QueueObject = tracks;

      return tracks;
    }
    else
    {
      throw new Error("Invalid response structure");
    }
  }

  // Get the currently playing track from Spotify
  public async getCurrentlyPlayingTrack(): Promise<any>
  {
    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<any>(`${this.apiUrl}/spotify/currently-playing`, {
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      if (!response.ok)
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    }
    catch (error)
    {
      console.error("Error fetching currently playing track:", error);
      throw error;
    }
  }

  // Set the currently playing track
  public setCurrentlyPlayingTrack(trackId: string): void
  {
    this.getTrackDetails(trackId).then(track =>
    {
      this.currentlyPlayingTrackSubject.next(track);
    });
  }

  // Get the details of a track by its Spotify ID
  public async getTrackDetails(trackId: string): Promise<any>
  {
    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<any>(`${this.apiUrl}/spotify/track-details`, {
        trackID: trackId,
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      if (!response)
      {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      return response;
    }
    catch (error)
    {
      console.error("Error fetching recently played tracks:", error);
      throw error;
    }
  }

  // Disconnect the player
  disconnectPlayer()
  {
    if (this.player)
    {
      this.player.disconnect().then(() =>
      {}).catch((error: any) =>
      {
        console.error("Failed to disconnect player", error);
      });
    }
  }

  // Truncate text to a specified length when song names are too long
  public truncateText(text: string, maxLength: number): string
  {
    if (text.length > maxLength)
    {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  // Add a track to the queue
  public async addTrackToQueue(trackId: string): Promise<void>
  {
    const fullTrackId: string = "spotify:track:" + trackId;

    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<any>(`${this.apiUrl}/spotify/add-to-queue`, {
        uri: fullTrackId,
        device_id: this.deviceId,
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      if (!response)
      {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      return response;
    }
    catch (error)
    {
      console.error("Error adding to queue: ", error);
      throw error;
    }
  }

  // Mute the player
  public async mute()
  {
    if (this.player)
    {
      this.player.setVolume(0);
    }
  }

  // Unmute the player
  public async unmute()
  {
    if (this.player)
    {
      this.player.setVolume(0.5);
    }
  }

  // This method is used to get the details of a track based on the track name and artist name
  public async getTrackDetailsByName(trackName: string, artistName: string): Promise<any>
  {
    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<any>(`${this.apiUrl}/spotify/track-details-by-name`, {
        trackName: trackName,
        artistName: artistName,
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();
      if (!response)
      {
        throw new Error(`HTTP error! Status: ${response}`);
      }
      return response;
    }
    catch (error)
    {
      console.error("Error fetching track details by name:", error);
    }
  }

  // This method is used to get the mood of a track based on its audio features
  public async getTrackMood(trackId: string): Promise<string>
  {
    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<TrackAnalysis>(`${this.apiUrl}/spotify/track-analysis`, {
        trackId: trackId,
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      if (!response)
      {
        throw new Error(`HTTP error! Status: ${response}`);
      }
      return this.classifyMood(response);
    }
    catch (error)
    {
      console.error("Error fetching track analysis:", error);
      throw error;
    }
  }

  public classifyMood(analysis: TrackAnalysis): string {
    const { valence, energy, danceability, tempo } = analysis;
  
    if (0.4 <= valence && valence <= 0.6 && 0.4 <= energy && energy <= 0.6) return "Neutral";
    if (valence < 0.4 && energy > 0.7) return "Anger";
    if (valence < 0.3 && energy > 0.6) return "Fear";
    if (valence > 0.7 && energy > 0.7) return "Joy";
    if (valence < 0.3 && energy > 0.5) return "Disgust";
    if (valence > 0.7 && energy > 0.8) return "Excitement";
    if (valence > 0.7 && energy < 0.7) return "Love";
    if (valence < 0.3 && energy < 0.5) return "Sadness";
    if (valence > 0.5 && energy > 0.7 && tempo > 120) return "Surprise";
    if (valence < 0.4 && energy < 0.4) return "Contempt";
    if (valence < 0.4 && 0.4 < energy && energy < 0.7) return "Shame";
    if (valence < 0.3 && energy < 0.4) return "Guilt";
    return "Neutral";
  }

  // Get the user's top artists from Spotify
  public async getTopArtists(): Promise<ArtistInfo[]>
  {
    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<any>(`${this.apiUrl}/spotify/top-artists`, {
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      if (!response)
      {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      return response.map((artist: any) =>
      {
        return {
          id: artist.id,
          name: artist.name,
          imageUrl: artist.imageUrl,
          spotifyUrl: artist.spotifyUrl
        } as ArtistInfo;
      });
    }
    catch (error)
    {
      console.error("Error fetching top artists:", error);
      throw error;
    }
  }

  // Get the user's top tracks from Spotify
  public async getTopTracks(): Promise<TrackInfo[]>
  {
    try
    {
      const laccessToken = this.tokenService.getAccessToken();
      const lrefreshToken = this.tokenService.getRefreshToken();
      const response = await this.http.post<any>(`${this.apiUrl}/spotify/top-tracks`, {
        accessToken: laccessToken,
        refreshToken: lrefreshToken
      }).toPromise();

      if (!response)
      {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      return response.map((track: any) =>
      {
        return {
          id: track.id,
          text: track.name,
          albumName: track.albumName,
          imageUrl: track.albumImageUrl,
          secondaryText: track.artistName,
          previewUrl: track.preview_url,
          spotifyUrl: track.spotifyUrl,
          explicit: false
        } as TrackInfo;
      });
    }
    catch (error)
    {
      console.error("Error fetching top tracks:", error);
      throw error;
    }
  }
}
