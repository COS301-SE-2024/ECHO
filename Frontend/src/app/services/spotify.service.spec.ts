import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SpotifyService, TrackInfo } from './spotify.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';
import { of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import axios from 'axios';
import { HttpClient, provideHttpClient } from '@angular/common/http';



jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

const MockPlayer = jest.fn().mockImplementation(() => ({
  addListener: jest.fn(),
  connect: jest.fn()
}));

jest.mock('axios');

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpClientMock: jest.Mocked<HttpClient>;;
  let authServiceMock: any;
  let tokenServiceMock: any;
  let providerServiceMock: any;
  let httpService: any;
  let mockPlayer: jest.Mocked<Spotify.Player>;
  let classifyMoodMock: jest.SpyInstance;
  
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockPlayer = new MockPlayer();

    httpClientMock = {
      post: jest.fn() as jest.MockedFunction<(url: string, body: any) => Promise<any>>
    } as any;

    authServiceMock = {
      getTokens: jest.fn(),
      setReady: jest.fn(),
    }

    tokenServiceMock = {
      getAccessToken: jest.fn(),
      getRefreshToken: jest.fn(),
    }

    providerServiceMock = {
      getProvider: jest.fn(),
    }

    httpService = {
      post: jest.fn()
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SpotifyService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HttpClient, useValue: httpClientMock
        }
      ],
    });
    service = TestBed.inject(SpotifyService);
    
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  describe('init', () => {
    it('should initialize Spotify SDK if platform is browser and not initialized', async () => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(true);
      jest.spyOn(service, 'initializeSpotify').mockResolvedValue();

      await service.init();

      expect(service.initializeSpotify).toHaveBeenCalled();
    });

    it('should not initialize Spotify SDK if platform is not browser', async () => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(false);
      jest.spyOn(service, 'initializeSpotify').mockResolvedValue();

      await service.init();

      expect(service.initializeSpotify).not.toHaveBeenCalled();
    });
  });

  describe('initializeSpotify', () => {
    it('should call loadSpotifySdk with the provider token on successful token fetch', async () => {
      const providerToken = 'mockProviderToken';
      authServiceMock.getTokens.mockReturnValue(of({ providerToken }));
  
      await service.initializeSpotify();
  
      expect(authServiceMock.getTokens).toHaveBeenCalled();
    });
  
    it('should log an error when token fetch fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Token fetch failed');
      authServiceMock.getTokens.mockReturnValue(throwError(error));
  
      await service.initializeSpotify();
  
      expect(authServiceMock.getTokens).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching Spotify token from AuthService:', error);
  
      consoleErrorSpy.mockRestore();
    });
  });

  describe('recentListeningCached', () => {
    it('should return false if recent listening is not cached', () => {
      sessionStorage.removeItem('recentListening');
      const result: boolean = service.recentListeningCached();
      expect(result).toBe(false);
    });
  });

  describe('queueCached', () => {
    it('should return false if queue is not cached', () => {
      sessionStorage.removeItem('queue');
      expect(service.queueCached()).toBe(false);
    });
  });

  describe('initializePlayer', () => {
    it('should initialize Spotify player and set device ID', () => {
      const providerToken = 'provider-token';
      const addListenerMock = jest.fn();
      window.Spotify = {
        Player: jest.fn().mockImplementation(() => ({
          addListener: addListenerMock,
          connect: jest.fn(),
        })),
      };

      service.initializePlayer(providerToken);

      expect(window.Spotify.Player).toHaveBeenCalledWith({
        name: 'ECHO',
        getOAuthToken: expect.any(Function),
        volume: 0.5,
      });
      expect(addListenerMock).toHaveBeenCalledWith('ready', expect.any(Function));
      expect(addListenerMock).toHaveBeenCalledWith('player_state_changed', expect.any(Function));
    });
  });

  describe('getCurrentPlaybackState', () => {
    it('should update playback progress subject', () => {
      const getCurrentStateMock = jest.fn().mockResolvedValue({
        position: 1000,
        duration: 2000,
      });
      service['player'] = {
        getCurrentState: getCurrentStateMock,
      } as any;

      service.getCurrentPlaybackState();

      expect(getCurrentStateMock).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('should pause playback', () => {
      const pauseMock = jest.fn().mockResolvedValue({});
      service['player'] = {
        pause: pauseMock,
      } as any;

      service.pause();

      expect(service['playingStateSubject'].value).toBe(false);
    });
  });

  describe('setVolume', () => {
    it('should set player volume', () => {
      const setVolumeMock = jest.fn().mockResolvedValue({});
      service['player'] = {
        setVolume: setVolumeMock,
      } as any;

      service.setVolume(0.5);

      expect(setVolumeMock).toHaveBeenCalledWith(0.5);
    });
  });

  describe('getRecentlyPlayedTracks', () => {
    it('should fetch and cache recently played tracks', async () => {
      const response = { items: [{ track: { name: 'track1', artists: [{ name: 'artist1' }] } }] };
      tokenServiceMock.getAccessToken.mockReturnValue('access-token');
      tokenServiceMock.getRefreshToken.mockReturnValue('refresh-token');

      service.getRecentlyPlayedTracks(null).then(data => {
        expect(data).toEqual(response);
      });

      //const req = httpClientMock.expectOne('http://localhost:3000/api/spotify/recently-played');
      //expect(req.request.method).toBe('POST');
      //req.flush(response);
    });
  });

  describe('getQueue', () => {
    it('should fetch and cache queue tracks', async () => {
      const recentlyPlayed = { items: [{ track: { name: 'track1', artists: [{ name: 'artist1' }] } }] };
      const queueResponse = { tracks: [{ id: 'track1', name: 'track1', album: { name: 'album1', images: [{ url: 'url1' }] }, artists: [{ name: 'artist1' }], preview_url: 'preview1', external_urls: { spotify: 'spotify1' }, explicit: false }] };
      tokenServiceMock.getAccessToken.mockReturnValue('access-token');
      tokenServiceMock.getRefreshToken.mockReturnValue('refresh-token');

      jest.spyOn(service, 'getRecentlyPlayedTracks').mockResolvedValue(recentlyPlayed);

      service.getQueue(null).then(data => {
        expect(data).toEqual([
          {
            id: 'track1',
            text: 'track1',
            albumName: 'album1',
            imageUrl: 'url1',
            secondaryText: 'artist1',
            previewUrl: 'preview1',
            spotifyUrl: 'spotify1',
            explicit: false,
          },
        ]);
      });
    });
  });

  describe('getCurrentlyPlayingTrack', () => {
    it('should fetch currently playing track', async () => {
      const response = { ok: true };
      tokenServiceMock.getAccessToken.mockReturnValue('access-token');
      tokenServiceMock.getRefreshToken.mockReturnValue('refresh-token');

      service.getCurrentlyPlayingTrack().then(data => {
        expect(data).toEqual(response);
      });

      //const req = httpClientMock.expectOne('http://localhost:3000/api/spotify/currently-playing');
      //expect(req.request.method).toBe('POST');
      //req.flush(response);
    });
  });

  describe('truncateText', () => {
    it('should truncate text to specified length', () => {
      const text = 'this is a long text';
      const maxLength = 10;
      const truncatedText = service.truncateText(text, maxLength);

      expect(truncatedText).toBe('this is a ...');
    });

    it('should not truncate text if it is shorter than max length', () => {
      const text = 'short text';
      const maxLength = 10;
      const truncatedText = service.truncateText(text, maxLength);

      expect(truncatedText).toBe('short text');
    });
  });

  describe('getQueue', () => {
    let mockResponse = {
      tracks: Array.from({ length: 7 }, (_, index) => ({
        id: `track${index + 1}`,
        name: `Track ${index + 1}`,
        album: { 
          name: `Album ${index + 1}`, 
          images: [{ url: `imageUrl${index + 1}` }] },
        artists: [{ name: `name${index + 1}` }],
        explicit: false,
        preview_url: `previewUrl${index + 1}`,
        external_urls: { spotify: `spotifyUrl${index + 1}` },
      }))
    };
    
    it('should throw an error if no recently played tracks are found', async () => {
      jest.spyOn(service, 'queueCached').mockReturnValue(false);
      jest.spyOn(service, 'getRecentlyPlayedTracks').mockResolvedValue({ items: [] });

      await expect(service.getQueue(null)).rejects.toThrow("No recently played tracks found");
    });

    it('should fetch queue from API and handle the response correctly', async () => {
      const mockRecentlyPlayed = {
        items: [{
          track: {
            id: 'track1',
            name: 'Track 1',
            artists: [{ name: 'Artist 1' }],
          }
        }]
      };

      mockResponse = {
        tracks: [{
          id: 'track1',
          name: 'Track 1',
          album: { name: 'Album 1', images: [{ url: 'imageUrl' }] },
          explicit: false,
          preview_url: 'previewUrl',
          external_urls: { spotify: 'spotifyUrl' },
          artists: []
        }]
      };

      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
      jest.spyOn(service, 'getRecentlyPlayedTracks').mockResolvedValue(mockRecentlyPlayed);
      httpClientMock.post.mockReturnValue(of(mockResponse));

      const result = await service.getQueue(null);

      expect(httpClientMock.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/spotify/queue',
        {
          artist: 'Artist 1',
          song_name: 'Track 1',
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        }
      );
      expect(result).toEqual([{
        id: 'track1',
        text: 'Track 1',
        albumName: 'Album 1',
        imageUrl: 'imageUrl',
        secondaryText: undefined,
        previewUrl: 'previewUrl',
        spotifyUrl: 'spotifyUrl',
        explicit: false,
      }]);
      expect(sessionStorage.getItem('queue')).toEqual(JSON.stringify(result));
    });

    it('should add tracks to the queue and set queueCreated if more than 5 tracks are added', async () => {
      const mockRecentlyPlayed = {
        items: [{
          track: {
            id: 'track1',
            name: 'Track 1',
            artists: [{ name: 'Artist 1' }],
          }
        }]
      };

      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
      jest.spyOn(service, 'getRecentlyPlayedTracks').mockResolvedValue(mockRecentlyPlayed);
      httpClientMock.post.mockReturnValue(of(mockResponse));

      const result = await service.getQueue(null);

      expect(result.length).toBe(1);
      expect(sessionStorage.getItem('queue')).toEqual(JSON.stringify(result));
    });

    it('should throw an error if the response structure is invalid', async () => {
      const mockRecentlyPlayed = {
        items: [{
          track: {
            artists: [{
              name: "eh"
            }],
            name: "ehh"

          }
        }]
    };
    jest.spyOn(Array, 'isArray').mockReturnValue(false);
    jest.spyOn(service, 'queueCached').mockReturnValue(false);
    jest.spyOn(service, 'getRecentlyPlayedTracks').mockResolvedValue(mockRecentlyPlayed);
    tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
    tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');

    // Mock the HTTP client to return an invalid structure (e.g., no tracks array)
    httpClientMock.post.mockReturnValue(of({items: "not array"})); // Invalid response structure

    await expect(service.getQueue(null)).rejects.toThrow('Invalid response structure');
    });
  });

  describe('getCurrentlyPlayingTrack', () => {
    it('should fetch currently playing track successfully', async () => {
      const mockResponse = { ok: true, id: 'some-track-id', name: 'Test Track' };
  
      // Mock token service
      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
  
      // Mock the HTTP client to return a successful response
      httpClientMock.post.mockReturnValue(of(mockResponse));
  
      const result = await service.getCurrentlyPlayingTrack();
  
      expect(httpClientMock.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/spotify/currently-playing',
        {
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        }
      );
      expect(result).toEqual(mockResponse); // Check if the result matches the mock response
    });
  
    it('should throw an error if response is not ok', async () => {
      // Mock token service
      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
  
      // Mock the HTTP client to return a response with ok = false
      const mockResponse = { ok: false, status: 404 };
      httpClientMock.post.mockReturnValue(of(mockResponse));
  
      // Execute the method and expect it to throw
      await expect(service.getCurrentlyPlayingTrack()).rejects.toThrow('HTTP error! status: 404');
    });
  
    it('should handle errors gracefully', async () => {
      // Mock token service
      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
  
      // Mock the HTTP client to return an error
      httpClientMock.post.mockReturnValue(throwError(() => new Error('HTTP error')));
  
      // Execute the method and expect it to throw
      await expect(service.getCurrentlyPlayingTrack()).rejects.toThrow('HTTP error');
  
      // Verify that console.error was called with the appropriate message
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching currently playing track:",
        expect.any(Error)
      );
    });
  });

  describe('getTrackDetails', () => {
    it('should fetch track details successfully', async () => {
      const trackId = 'some-track-id';
      const mockResponse = { id: trackId, name: 'Test Track' };
  
      // Mock token service
      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
  
      // Mock the HTTP client to return a successful response
      httpClientMock.post.mockReturnValue(of(mockResponse));
  
      const result = await service.getTrackDetails(trackId);
  
      expect(httpClientMock.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/spotify/track-details',
        {
          trackID: trackId,
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        }
      );
      expect(result).toEqual(mockResponse); // Check if the result matches the mock response
    });
  
    it('should handle errors gracefully', async () => {
      const trackId = 'some-track-id';
  
      // Mock token service
      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
  
      // Mock the HTTP client to return an error
      httpClientMock.post.mockReturnValue(throwError(() => new Error('HTTP error')));
  
      // Execute the method and expect it to throw
      await expect(service.getTrackDetails(trackId)).rejects.toThrow('HTTP error');
  
      // Verify that console.error was called with the appropriate message
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching recently played tracks:",
        expect.any(Error)
      );
    });
  
    it('should throw an error if response is null or undefined', async () => {
      const trackId = 'some-track-id';
  
      // Mock token service
      tokenServiceMock.getAccessToken.mockReturnValue('mockAccessToken');
      tokenServiceMock.getRefreshToken.mockReturnValue('mockRefreshToken');
  
      // Mock the HTTP client to return a null response
      httpClientMock.post.mockReturnValue(of(null));
  
      // Execute the method and expect it to throw
      await expect(service.getTrackDetails(trackId)).rejects.toThrow('HTTP error! Status: null');
    });
  });

  describe('truncateText', () => {
    it('should return the original text if length is less than maxLength', () => {
      const text = "Hello";
      const maxLength = 10;
  
      const result = service.truncateText(text, maxLength);
  
      expect(result).toBe(text); // Expect the original text to be returned
    });
  
    it('should return the original text if length is equal to maxLength', () => {
      const text = "Hello World";
      const maxLength = 11;
  
      const result = service.truncateText(text, maxLength);
  
      expect(result).toBe(text); // Expect the original text to be returned
    });
  
    it('should truncate the text and add "..." if length is greater than maxLength', () => {
      const text = "Hello World";
      const maxLength = 5;
  
      const result = service.truncateText(text, maxLength);
  
      expect(result).toBe("Hello..."); // Expect truncated text with "..."
    });
  });
/*
  describe('addTrackToQueue', () => {
    it('should successfully add a track to the queue', async () => {
      const trackId = '123';
      const fullTrackId = 'spotify:track:123';
      const mockResponse = {} as never; // Mock a successful response
  
      // Mock the HTTP post request
      httpClientMock.post.mockResolvedValueOnce(mockResponse);
  
      // Call the service method
      await service.addTrackToQueue(trackId);
  
      // Ensure the correct HTTP request was made
      expect(httpClientMock.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/spotify/add-to-queue',
        {
          uri: fullTrackId,
          device_id: (service as any).deviceId, // Assuming deviceId is part of the service
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken'
        }
      );
    });
  
    it('should throw an error if response is null', async () => {
      const trackId = '123';
  
      // Mock the HTTP post request returning null
      httpClientMock.post.mockResolvedValueOnce(null as never);
  
      // Call the method and expect an error to be thrown
      await expect(service.addTrackToQueue(trackId)).rejects.toThrow('HTTP error! Status: null');
    });
  
    it('should log an error if the HTTP request fails', async () => {
      const trackId = '123';
      const error = new Error('Network error');
  
      // Spy on the console.error method
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Mock the HTTP post request to throw an error
      httpClientMock.post.mockRejectedValueOnce(error as never);
  
      // Call the method and expect an error
      await expect(service.addTrackToQueue(trackId)).rejects.toThrow('Network error');
  
      // Ensure the error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding to queue: ', error);
  
      // Restore the original console.error
      consoleErrorSpy.mockRestore();
    });
  });
*/
  describe('getTrackDetailsByName', () => {
    it('should return track details successfully', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock a valid track detail response
      const mockResponse = { trackId: '123', trackName: 'Test Track', artistName: 'Test Artist' };
      httpClientMock.post.mockReturnValue(of(mockResponse));
  
      // Call the method and expect it to return the correct track details
      const result = await service.getTrackDetailsByName('Test Track', 'Test Artist');
      expect(result).toEqual(mockResponse);
  
      // Verify the correct API request was made
      expect(httpClientMock.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/spotify/track-details-by-name",
        {
          trackName: 'Test Track',
          artistName: 'Test Artist',
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken
        }
      );
    });
  
    it('should handle undefined response without throwing', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock an undefined response to simulate an error
      httpClientMock.post.mockReturnValue(of(undefined));
  
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Call the method, expecting it to return undefined and log an error
      const result = await service.getTrackDetailsByName('Test Track', 'Test Artist');
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching track details by name:', expect.any(Error));
  
      // Restore the console.error mock
      consoleSpy.mockRestore();
    });
  
    it('should handle null response without throwing', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock a null response
      httpClientMock.post.mockReturnValue(of(null));
  
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Call the method, expecting it to return undefined and log an error
      const result = await service.getTrackDetailsByName('Test Track', 'Test Artist');
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching track details by name:', expect.any(Error));
  
      // Restore the console.error mock
      consoleSpy.mockRestore();
    });
  
    it('should handle TokenService failure without throwing', async () => {
      // Mock TokenService to return undefined tokens
      tokenServiceMock.getAccessToken.mockReturnValue(undefined);
      tokenServiceMock.getRefreshToken.mockReturnValue(undefined);
  
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Call the method, expecting it to return undefined due to missing tokens
      const result = await service.getTrackDetailsByName('Test Track', 'Test Artist');
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching track details by name:', expect.any(Error));
  
      // Restore the console.error mock
      consoleSpy.mockRestore();
    });
  
    it('should log errors if post request fails', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock the post method to throw an error
      httpClientMock.post.mockReturnValue(throwError(() => new Error('Network error')));
  
      // Spy on console.error to ensure the error is logged
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Call the method, expecting it to return undefined and log the error
      const result = await service.getTrackDetailsByName('Test Track', 'Test Artist');
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching track details by name:', expect.any(Error));
  
      // Restore the console.error mock
      consoleSpy.mockRestore();
    });
  });

  describe('getTrackMood', () => {
    it('should return track mood successfully', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock a valid TrackAnalysis response
      const mockTrackAnalysis = {
        valence: 0.8,
        energy: 0.7,
        danceability: 0.6,
        tempo: 120
      };
      httpClientMock.post.mockReturnValue(of(mockTrackAnalysis));
  
      // Call the method and expect it to classify the mood correctly
      const result = await service.getTrackMood('mockTrackId');
      expect(result).not.toBe(null);
  
      // Verify the correct API request was made
      expect(httpClientMock.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/spotify/track-analysis",
        {
          trackId: 'mockTrackId',
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken
        }
      );
    });
  
    it('should handle HTTP errors', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock a null response to simulate an error
      httpClientMock.post.mockReturnValue(of(undefined));
  
      // Expect the method to throw an error
      await expect(service.getTrackMood('mockTrackId')).rejects.toThrow('HTTP error! Status: undefined');
    });
  
    it('should handle empty track analysis responses', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock an empty response
      httpClientMock.post.mockReturnValue(of(null));
  
      // Expect the method to throw an error
      await expect(service.getTrackMood('mockTrackId')).rejects.toThrow('HTTP error! Status: null');
    });
  
    it('should throw an error if TokenService fails', async () => {
      // Mock TokenService to return undefined tokens
      tokenServiceMock.getAccessToken.mockReturnValue(undefined);
      tokenServiceMock.getRefreshToken.mockReturnValue(undefined);
  
      // Expect the method to throw an error due to missing tokens
      await expect(service.getTrackMood('mockTrackId')).rejects.toThrow();
    });
  
    it('should log errors to the console and rethrow', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock the post method to throw an error
      httpClientMock.post.mockReturnValue(throwError(() => new Error('Network error')));
  
      // Spy on console.error to ensure the error is logged
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Expect the method to throw the error
      await expect(service.getTrackMood('mockTrackId')).rejects.toThrow('Network error');
  
      // Ensure the error was logged
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching track analysis:', expect.any(Error));
  
      // Restore the console error mock
      consoleSpy.mockRestore();
    });
  });

  describe('getTopArtists', () => {
    it('should return top artists successfully', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      
      // Set the mock implementation for the TokenService
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock the post method to return a valid response
      const mockArtists = [
        { id: '1', name: 'Artist 1', imageUrl: 'artist1.jpg', spotifyUrl: 'https://spotify.com/artist1' },
        { id: '2', name: 'Artist 2', imageUrl: 'artist2.jpg', spotifyUrl: 'https://spotify.com/artist2' }
      ];
      httpClientMock.post.mockReturnValue(of(mockArtists));
  
      // Call the function and expect a valid result
      const result = await service.getTopArtists();
  
      expect(result).toEqual([
        { id: '1', name: 'Artist 1', imageUrl: 'artist1.jpg', spotifyUrl: 'https://spotify.com/artist1' },
        { id: '2', name: 'Artist 2', imageUrl: 'artist2.jpg', spotifyUrl: 'https://spotify.com/artist2' }
      ]);
  
      // Verify that the tokens were used in the request
      expect(httpClientMock.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/spotify/top-artists",
        { accessToken: mockAccessToken, refreshToken: mockRefreshToken }
      );
    });
  
    it('should handle empty responses', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock the post method to return an empty array
      httpClientMock.post.mockReturnValue(of([]));
  
      // Call the function and expect an empty result
      const result = await service.getTopArtists();
  
      expect(result).toEqual([]);
    });
  
    it('should handle HTTP errors', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock the post method to return undefined to simulate an HTTP error
      httpClientMock.post.mockReturnValue(of(undefined));
  
      // Expect an error to be thrown with the correct message
      await expect(service.getTopArtists()).rejects.toThrow('HTTP error! Status: undefined');
    });
  
    it('should throw an error if TokenService fails', async () => {
      // Set the mock implementation for the TokenService to return undefined tokens
      tokenServiceMock.getAccessToken.mockReturnValue(undefined);
      tokenServiceMock.getRefreshToken.mockReturnValue(undefined);
  
      // Attempt to fetch top artists and expect an error due to missing tokens
      await expect(service.getTopArtists()).rejects.toThrow();
    });
  
    it('should log errors to the console and rethrow', async () => {
      // Mock tokens
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock the post method to throw an error
      httpClientMock.post.mockReturnValue(throwError(() => new Error('Network error')));
  
      // Spy on console.error to ensure the error is logged
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Expect the error to be caught and rethrown
      await expect(service.getTopArtists()).rejects.toThrow('Network error');
  
      // Ensure the error was logged to the console
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching top artists:', expect.any(Error));
  
      // Restore the console error mock
      consoleSpy.mockRestore();
    });
  });

  describe('getTopTracks', () => {
    it('should return top tracks', async () => {
      const mockResponse = [
        {
          id: 'track-id-1',
          name: 'Track 1',
          albumName: 'Album 1',
          albumImageUrl: 'http://example.com/image1.jpg',
          artistName: 'Artist 1',
          preview_url: 'http://example.com/preview1.mp3',
          spotifyUrl: 'http://spotify.com/track-id-1',
        },
        {
          id: 'track-id-2',
          name: 'Track 2',
          albumName: 'Album 2',
          albumImageUrl: 'http://example.com/image2.jpg',
          artistName: 'Artist 2',
          preview_url: 'http://example.com/preview2.mp3',
          spotifyUrl: 'http://spotify.com/track-id-2',
        }
      ];

      httpClientMock.post.mockReturnValue(of(mockResponse));
      tokenServiceMock.getAccessToken.mockReturnValue('access-token');
      tokenServiceMock.getRefreshToken.mockReturnValue('refresh-token');

      // Simulate the HTTP POST request
      //const req = httpClientMock.expectOne('http://localhost:3000/api/spotify/top-tracks');
      //expect(req.request.method).toBe('POST');
      //req.flush(mockResponse);

      const tracks = await service.getTopTracks();

      expect(tracks).toEqual([
        {
          id: 'track-id-1',
          text: 'Track 1',
          albumName: 'Album 1',
          imageUrl: 'http://example.com/image1.jpg',
          secondaryText: 'Artist 1',
          previewUrl: 'http://example.com/preview1.mp3',
          spotifyUrl: 'http://spotify.com/track-id-1',
          explicit: false
        },
        {
          id: 'track-id-2',
          text: 'Track 2',
          albumName: 'Album 2',
          imageUrl: 'http://example.com/image2.jpg',
          secondaryText: 'Artist 2',
          previewUrl: 'http://example.com/preview2.mp3',
          spotifyUrl: 'http://spotify.com/track-id-2',
          explicit: false
        }
      ]);

      expect(httpClientMock.post).toHaveBeenCalledWith("http://localhost:3000/api/spotify/top-tracks", {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });
    });

    it('should handle HTTP errors', async () => {

      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';

      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);
      httpClientMock.post.mockReturnValue(of(undefined));
      // Simulate an HTTP error response
      //const req = httpClientMock.expectOne('http://localhost:3000/api/spotify/top-tracks');
      //expect(req.request.method).toBe('POST');
      //req.flush('error', { status: 500 });

      await expect(service.getTopTracks()).rejects.toThrow('HTTP error! Status: undefined');
    });

    it('should handle empty responses', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';

      tokenServiceMock.getAccessToken.mockReturnValue(mockAccessToken);
      tokenServiceMock.getRefreshToken.mockReturnValue(mockRefreshToken);

      const errorMessage = 'Network error';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));
      // Simulate an empty response
      //const req = httpClientMock.expectOne('http://localhost:3000/api/spotify/top-tracks');
      //expect(req.request.method).toBe('POST');
      //req.flush([]);

      await expect(service.getTopTracks()).rejects.toThrow(errorMessage);

      // Verify that the error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching top tracks:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should throw error on exception', async () => {
      // Simulate a case where getAccessToken or getRefreshToken throws an error
      tokenServiceMock.getAccessToken.mockImplementation(() => {
        throw new Error('Token error');
      });

      await expect(service.getTopTracks()).rejects.toThrow('Token error');
    });
  });
});

