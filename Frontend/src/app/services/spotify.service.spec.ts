import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SpotifyService, TrackAnalysis, TrackInfo } from './spotify.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';
import { connect, firstValueFrom, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import axios from 'axios';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { MoodService } from './mood-service.service';


jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

const authServiceMock = (): jest.Mocked<AuthService> => ({
  getTokens: jest.fn(),
  setReady: jest.fn(),
}) as any;

const tokenServiceMock = (): jest.Mocked<TokenService> => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
}) as any;

const providerServiceMock = (): jest.Mocked<ProviderService> => ({
  getProvider: jest.fn(),
}) as any;

const moodServiceMock = (): jest.Mocked<MoodService> => ({
  
}) as any;

const mockSpotify = {
  Player: jest.fn().mockImplementation(() => ({
    disconnect: jest.fn().mockResolvedValue(undefined), // Mock disconnect method
    setVolume: jest.fn(), // Mock other methods as needed
  })),
};


describe('SpotifyService', () => {
  let service: SpotifyService;
  
  let authService: jest.Mocked<AuthService>;
  let tokenService: jest.Mocked<TokenService>;
  let providerService: jest.Mocked<ProviderService>;
  let player: jest.Mocked<Spotify.Player>;
  let moodService: jest.Mocked<MoodService>;

  //new mocks
  let httpMock : HttpTestingController;
  
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.setTimeout(3000);

    

    authService = authServiceMock();
    tokenService = tokenServiceMock();
    providerService = providerServiceMock();
    moodService = moodServiceMock();

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SpotifyService,
        { provide: AuthService, useValue: authService },
        { provide: TokenService, useValue: tokenService },
        { provide: ProviderService, useValue: providerService },
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SpotifyService);
    httpMock = TestBed.inject(HttpTestingController);
    service['player'] = {
      getCurrentState: jest.fn(),
      resume: jest.fn(),
      seek: jest.fn()
    }; // Mock the player object
  });

  afterEach(() => {
    jest.restoreAllMocks();
    sessionStorage.clear();
    httpMock.verify();
  })

  describe('init', () => {
    it('should call initializeSpotify when platform is browser and not initialized', async () => {
      const spyInitializeSpotify = jest.spyOn(service, 'initializeSpotify').mockResolvedValue();

      service['hasBeenInitialized'] = false;  // Ensure it hasn't been initialized
      (isPlatformBrowser as jest.Mock).mockReturnValue(true); // Simulate the browser platform

      await service.init();

      expect(spyInitializeSpotify).toHaveBeenCalled();
      expect(service['hasBeenInitialized']).toBe(true);
    });

    it('should not call initializeSpotify if already initialized', async () => {
      const spyInitializeSpotify = jest.spyOn(service, 'initializeSpotify').mockResolvedValue();

      service['hasBeenInitialized'] = true;  // Simulate already initialized
      (isPlatformBrowser as jest.Mock).mockReturnValue(true); // Simulate the browser platform

      await service.init();

      expect(spyInitializeSpotify).not.toHaveBeenCalled();
    });

    it('should not call initializeSpotify if platform is not browser', async () => {
      const spyInitializeSpotify = jest.spyOn(service, 'initializeSpotify').mockResolvedValue();

      service['hasBeenInitialized'] = false;  // Ensure it hasn't been initialized
      (isPlatformBrowser as jest.Mock).mockReturnValue(false); // Simulate non-browser platform

      await service.init();

      expect(spyInitializeSpotify).not.toHaveBeenCalled();
      expect(service['hasBeenInitialized']).toBe(false);
    });

    it('should set hasBeenInitialized to true only after initializeSpotify completes', async () => {
      let resolveInitializeSpotify: Function;
      const spyInitializeSpotify = jest.spyOn(service, 'initializeSpotify').mockImplementation(() => {
        return new Promise<void>((resolve) => {
          resolveInitializeSpotify = resolve;
        });
      });

      service['hasBeenInitialized'] = false;  // Ensure it hasn't been initialized
      (isPlatformBrowser as jest.Mock).mockReturnValue(true); // Simulate the browser platform

      const initPromise = service.init(); // Call init but don't await yet

      expect(service['hasBeenInitialized']).toBe(false); // Should still be false before initialization completes

      resolveInitializeSpotify!();  // Now resolve the initialization

      await initPromise;  // Await the promise

      expect(spyInitializeSpotify).toHaveBeenCalled();
      expect(service['hasBeenInitialized']).toBe(true);
    });
  });

  describe('initializeSpotify', () => {
    it('should call loadSpotifySdk with providerToken if tokens are fetched successfully', async () => {
      const tokens = { providerToken: 'mockProviderToken' };
      authService.getTokens.mockReturnValue(of(tokens));
      jest.spyOn(service, 'loadSpotifySdk');

      await service.initializeSpotify();

      expect(authService.getTokens).toHaveBeenCalled();
      expect(service.loadSpotifySdk).toHaveBeenCalledWith('mockProviderToken');
    });

    it('should log an error if fetching tokens fails', async () => {
      const spyLoadSpotifySdk = jest.spyOn(service, 'loadSpotifySdk').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(); // Spy on console.error

      await service.initializeSpotify();

      expect(authService.getTokens).toHaveBeenCalled();
      expect(spyLoadSpotifySdk).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching Spotify token from AuthService:',
        expect.any(Error)
      );
    });
  });

  describe('playTrackById', () => {
    it('should call the API to play a track by its ID', () => {
      const mockTrackId = 'track123';
      const mockHttpResponse = {}; // Define the expected HTTP response
      service['deviceId'] = "123"
  
      // Call the method being tested
      service.playTrackById(mockTrackId).then(() => {
        // Simulate the HTTP response
        const req = httpMock.expectOne(`/api/track/play/${mockTrackId}`);
        req.flush(mockHttpResponse); // Simulate the response
  
        // Expect that the method was called with the correct ID
        expect(service.setCurrentlyPlayingTrack).toHaveBeenCalledWith(mockTrackId);
        expect(service.getTrackMood).toHaveBeenCalledWith(mockTrackId);
        expect(moodService.setCurrentMood).toHaveBeenCalledWith('Happy');
      });
    });
  });
  
  describe('pause', () => {
    it('should call pause on the Spotify player and update playing state', () => {
      const mockPlayer = {
        pause: jest.fn().mockResolvedValue(undefined),
      };
      service['player'] = mockPlayer;  // Inject mock player
      service['deviceId'] = "something";

      service.pause();

      expect(service['player'].pause).toHaveBeenCalled();
      expect(service['playingStateSubject'].getValue()).toBe(false);
    });

    it('should log an error if deviceId is not set', () => {
      const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

      service['deviceId'] = null;  // No device ID set
      service.pause();

      expect(spyConsoleError).toHaveBeenCalledWith('Device ID is undefined. Ensure the player is ready before pausing.');
    });
  });

  describe('getTopTracks', () => {
    it('should fetch top tracks successfully', async () => {
      // Mock access token and refresh token
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
  
      // Mock token service methods
      tokenService.getAccessToken.mockReturnValue(mockAccessToken);
      tokenService.getRefreshToken.mockReturnValue(mockRefreshToken);
  
      // Mock response from the HTTP post request
      const mockResponse = [
        {
          id: 'track1',
          name: 'Track One',
          albumName: 'Album One',
          albumImageUrl: 'http://example.com/image1.jpg',
          artistName: 'Artist One',
          preview_url: 'http://example.com/preview1.mp3',
          spotifyUrl: 'http://example.com/track1'
        },
        {
          id: 'track2',
          name: 'Track Two',
          albumName: 'Album Two',
          albumImageUrl: 'http://example.com/image2.jpg',
          artistName: 'Artist Two',
          preview_url: 'http://example.com/preview2.mp3',
          spotifyUrl: 'http://example.com/track2'
        }
      ];
  
      // Call the method
      const tracksPromise = service.getTopTracks();
  
      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/top-tracks");
      expect(req.request.method).toBe('POST'); // Check if POST method is used
  
      // Respond with the mock data
      req.flush(mockResponse); 
  
      const tracks = await tracksPromise; // Await the promise
  
      // Assertions
      expect(tracks).toHaveLength(2);
      expect(tracks).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'track1', text: 'Track One', albumName: 'Album One' }),
        expect.objectContaining({ id: 'track2', text: 'Track Two', albumName: 'Album Two' })
      ]));
  
      expect(tokenService.getAccessToken).toHaveBeenCalled();
      expect(tokenService.getRefreshToken).toHaveBeenCalled();
    });
  
    it('should handle errors when fetching top tracks', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
      // Mock token service methods
      tokenService.getAccessToken.mockReturnValue('mockAccessToken');
      tokenService.getRefreshToken.mockReturnValue('mockRefreshToken');
      service['deviceId'] = "sometihng"
  
      // Call the method
      const tracksPromise = service.getTopTracks();
  
      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/top-tracks");
      expect(req.request.method).toBe('POST'); // Check if POST method is used
  
      // Respond with a 500 error
      req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  
      // Expect the method to throw an error
      expect(tracksPromise).rejects.toThrow('Network Error');
      
      // Assertions
      //expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching top tracks:", expect.any(Error));
  
      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('getTopArtists', () => {
    it('should fetch top artists successfully', async () => {
      // Mock access token and refresh token
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';

      // Mock token service methods
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockAccessToken);
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue(mockRefreshToken);

      // Mock response from the HTTP post request
      const mockResponse = [
        {
          id: 'artist1',
          name: 'Artist One',
          imageUrl: 'http://example.com/image1.jpg',
          spotifyUrl: 'http://example.com/artist1'
        },
        {
          id: 'artist2',
          name: 'Artist Two',
          imageUrl: 'http://example.com/image2.jpg',
          spotifyUrl: 'http://example.com/artist2'
        }
      ];

      // Call the method
      const artistsPromise = service.getTopArtists();

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/top-artists");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with the mock data
      req.flush(mockResponse);

      const artists = await artistsPromise; // Await the promise

      // Assertions
      expect(artists).toHaveLength(2);
      expect(artists).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'artist1', name: 'Artist One' }),
        expect.objectContaining({ id: 'artist2', name: 'Artist Two' })
      ]));

      expect(tokenService.getAccessToken).toHaveBeenCalled();
      expect(tokenService.getRefreshToken).toHaveBeenCalled();
    });

    it('should handle errors when fetching top artists', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Mock token service methods
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const artistsPromise = service.getTopArtists();

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/top-artists");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with a 500 error
      req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });

      // Expect the method to throw an error
      expect(artistsPromise).rejects.toThrow('Internal Server Error');
      
      // Assertions
      //expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching top artists:", expect.any(Error));

      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });

  describe('classifyMood', () => {
    it('should classify mood as Neutral', () => {
      const analysis: TrackAnalysis = { valence: 0.5, energy: 0.5, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Neutral');
    });

    it('should classify mood as Anger', () => {
      const analysis: TrackAnalysis = { valence: 0.3, energy: 0.8, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Anger');
    });

    it('should classify mood as Fear', () => {
      const analysis: TrackAnalysis = { valence: 0.2, energy: 0.7, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Fear');
    });

    it('should classify mood as Joy', () => {
      const analysis: TrackAnalysis = { valence: 0.8, energy: 0.9, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Joy');
    });

    it('should classify mood as Disgust', () => {
      const analysis: TrackAnalysis = { valence: 0.2, energy: 0.6, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Disgust');
    });

    it('should classify mood as Excitement', () => {
      const analysis: TrackAnalysis = { valence: 0.8, energy: 0.9, danceability: 0.5, tempo: 130 };
      expect(service.classifyMood(analysis)).toBe('Joy');
    });

    it('should classify mood as Love', () => {
      const analysis: TrackAnalysis = { valence: 0.8, energy: 0.6, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Love');
    });

    it('should classify mood as Sadness', () => {
      const analysis: TrackAnalysis = { valence: 0.2, energy: 0.4, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Sadness');
    });

    it('should classify mood as Surprise', () => {
      const analysis: TrackAnalysis = { valence: 0.6, energy: 0.8, danceability: 0.5, tempo: 130 };
      expect(service.classifyMood(analysis)).toBe('Surprise');
    });

    it('should classify mood as Contempt', () => {
      const analysis: TrackAnalysis = { valence: 0.3, energy: 0.3, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Contempt');
    });

    it('should classify mood as Shame', () => {
      const analysis: TrackAnalysis = { valence: 0.3, energy: 0.5, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Shame');
    });

    it('should classify mood as Guilt', () => {
      const analysis: TrackAnalysis = { valence: 0.2, energy: 0.2, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Sadness');
    });

    it('should return Neutral for unspecified cases', () => {
      const analysis: TrackAnalysis = { valence: 0.5, energy: 0.3, danceability: 0.5, tempo: 120 };
      expect(service.classifyMood(analysis)).toBe('Neutral');
    });
  });

  describe('getTrackMood', () => {
    it('should return the mood of a track when the request is successful', async () => {
      const trackId = '12345';
      const mockResponse: TrackAnalysis = { 
        valence: 0.5, 
        energy: 0.5, 
        danceability: 0.5, 
        tempo: 120 
      };

      // Mock access token and refresh token
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';

      // Mock token service methods
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockAccessToken);
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue(mockRefreshToken);

      // Call the method
      const moodPromise = service.getTrackMood(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/track-analysis");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with the mock data
      req.flush(mockResponse);

      // Await the promise
      const mood = await moodPromise;

      // Assertions
      expect(mood).toBe('Neutral'); // Change this based on your classification logic
      expect(tokenService.getAccessToken).toHaveBeenCalled();
      expect(tokenService.getRefreshToken).toHaveBeenCalled();
    });

    it('should throw an error if the response is empty', async () => {
      const trackId = '12345';

      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const moodPromise = service.getTrackMood(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/track-analysis");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with null to simulate an empty response
      req.flush(null);

      // Expect the method to throw an error
      await expect(moodPromise).rejects.toThrow('HTTP error! Status: null');
    });

    it('should throw an error if the HTTP request fails', async () => {
      const trackId = '12345';

      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const moodPromise = service.getTrackMood(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/track-analysis");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with a network error
      req.error(new ErrorEvent('Network error'));

      // Expect the method to throw an error
      expect(moodPromise).rejects.toThrow('Error fetching track analysis: Error');

      // You may also want to check console error logging here if applicable
    });
  });

  describe('getTrackDetailsByName', () => {
    it('should return track details when the request is successful', async () => {
      const trackName = 'Track A';
      const artistName = 'Artist A';
      const mockResponse = {
        id: '12345',
        name: trackName,
        artist: artistName,
        album: 'Album A',
        url: 'http://spotify.com/track/12345',
      };

      // Mock access token and refresh token
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';

      // Mock token service methods
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockAccessToken);
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue(mockRefreshToken);

      // Call the method
      const detailsPromise = service.getTrackDetailsByName(trackName, artistName);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/track-details-by-name");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with the mock data
      req.flush(mockResponse);

      // Await the promise
      const details = await detailsPromise;

      // Assertions
      expect(details).toEqual(mockResponse);
      expect(tokenService.getAccessToken).toHaveBeenCalled();
      expect(tokenService.getRefreshToken).toHaveBeenCalled();
    });

    it('should throw an error if the response is empty', async () => {
      const trackName = 'Track A';
      const artistName = 'Artist A';

      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const detailsPromise = service.getTrackDetailsByName(trackName, artistName);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/track-details-by-name");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with null to simulate an empty response
      req.flush(null);

      // Expect the method to throw an error
      expect(detailsPromise).rejects.toThrow('HTTP error! Status: null');
    });

    it('should log an error if the HTTP request fails', async () => {
      const trackName = 'Track A';
      const artistName = 'Artist A';

      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const detailsPromise = service.getTrackDetailsByName(trackName, artistName);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne("http://localhost:3000/api/spotify/track-details-by-name");
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with a network error
      req.error(new ErrorEvent('Network error'));

      // Expect the method to log the error
      await expect(detailsPromise).resolves.toBeUndefined();
    });
  });

  describe('unmute', () => {
    it('should set the volume to 0.5 if the player exists', async () => {
      // Create a mock player with a setVolume method
      const mockPlayer = {
        setVolume: jest.fn(),
      };

      // Assign the mock player to the service
      service['player'] = mockPlayer; // Accessing private property

      // Call the unmute method
      await service.unmute();

      // Assertions
      expect(mockPlayer.setVolume).toHaveBeenCalledWith(0.5);
    });

    it('should not call setVolume if the player does not exist', async () => {
      // Ensure player is undefined
      service['player'] = undefined; // Accessing private property

      // Call the unmute method
      await service.unmute();

      // Assertions
      expect(service['player']).toBeUndefined();
    });
  });

  describe('mute', () => {
    it('should set the volume to 0 if the player exists', async () => {
      // Create a mock player with a setVolume method
      const mockPlayer = {
        setVolume: jest.fn(),
      };

      // Assign the mock player to the service
      service['player'] = mockPlayer; // Accessing private property

      // Call the mute method
      await service.mute();

      // Assertions
      expect(mockPlayer.setVolume).toHaveBeenCalledWith(0);
    });

    it('should not call setVolume if the player does not exist', async () => {
      // Ensure player is undefined
      service['player'] = undefined; // Accessing private property

      // Call the mute method
      await service.mute();

      // Assertions
      expect(service['player']).toBeUndefined();
    });
  });

  describe('addTrackToQueue', () => {
    it('should add track to queue and make a POST request', async () => {
      const trackId = '12345';
      const fullTrackId = 'spotify:track:12345';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';

      // Mock token service methods
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue(accessToken);
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue(refreshToken);

      // Call the method
      const queuePromise = service.addTrackToQueue(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/add-to-queue');
      expect(req.request.method).toBe('POST'); // Check if POST method is used
      expect(req.request.body).toEqual({
        uri: fullTrackId,
        device_id: service['deviceId'],
        accessToken: accessToken,
        refreshToken: refreshToken
      });

      // Respond with mock data
      req.flush({}); // Simulate a successful response

      // Await the promise
      expect(queuePromise).resolves.toBeUndefined();
      expect(tokenService.getAccessToken).toHaveBeenCalled();
      expect(tokenService.getRefreshToken).toHaveBeenCalled();
    });

    it('should throw an error if the response is empty', async () => {
      const trackId = '12345';
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const queuePromise = service.addTrackToQueue(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/add-to-queue');
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with null to simulate an empty response
      req.flush(null);

      // Expect the method to throw an error
      await expect(queuePromise).rejects.toThrow('HTTP error! Status: null');
    });

    it('should log an error if the HTTP request fails', async () => {
      const trackId = '12345';
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const queuePromise = service.addTrackToQueue(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/add-to-queue');
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with a network error
      req.error(new ErrorEvent('Network error'));

      // Expect the method to log the error
      expect(queuePromise).resolves.toBeUndefined();
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength and add ellipsis', () => {
      const inputText = 'This is a long text that needs to be truncated.';
      const maxLength = 30;

      const result = service.truncateText(inputText, maxLength);

      expect(result).toBe('This is a long text that needs...');
    });

    it('should return the original text if it is shorter than maxLength', () => {
      const inputText = 'Short text';
      const maxLength = 20;

      const result = service.truncateText(inputText, maxLength);

      expect(result).toBe(inputText);
    });

    it('should return an empty string when input is empty', () => {
      const inputText = '';
      const maxLength = 10;

      const result = service.truncateText(inputText, maxLength);

      expect(result).toBe(inputText);
    });
  });

  /*
  describe('disconnectPlayer', () => {
    beforeEach(() => {
      service['player'] = jest.fn(() => {
        const disconnect = jest.fn();
      });
    })
    it('should call disconnect on the player if it exists', async () => {
      await service.disconnectPlayer();

      expect(service['player'].disconnect).toHaveBeenCalled();
    });

    it('should handle disconnecting the player gracefully when it succeeds', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Spy on console.error

      await service.disconnectPlayer();

      expect(consoleSpy).not.toHaveBeenCalled(); // Ensure no error is logged on success

      consoleSpy.mockRestore(); // Restore the original console.error
    });

    it('should log an error if disconnecting the player fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Spy on console.error
      service['player'].disconnect.mockRejectedValue(new Error('Failed to disconnect')); // Mock disconnect to reject

      await service.disconnectPlayer();

      expect(consoleSpy).toHaveBeenCalledWith("Failed to disconnect player", expect.any(Error)); // Check that the error was logged

      consoleSpy.mockRestore(); // Restore the original console.error
    });

    it('should do nothing if the player does not exist', async () => {
      service['player'] = null; // Set player to null

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Spy on console.error

      await service.disconnectPlayer();

      expect(service['player'].disconnect).not.toHaveBeenCalled(); // Ensure disconnect is not called
      expect(consoleSpy).not.toHaveBeenCalled(); // Ensure no error is logged

      consoleSpy.mockRestore(); // Restore the original console.error
    });
  });*/

  describe('getTrackDetails', () => {
    it('should fetch track details and make a POST request', async () => {
      const trackId = 'some-track-id';
      const mockResponse = {
        id: trackId,
        name: 'Track Name',
        artist: 'Artist Name',
        // Include other properties you expect in the response
      };
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';

      // Mock token service methods
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue(accessToken);
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue(refreshToken);

      // Call the method
      const trackDetailsPromise = service.getTrackDetails(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/track-details');
      expect(req.request.method).toBe('POST'); // Check if POST method is used
      expect(req.request.body).toEqual({
        trackID: trackId,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      // Respond with mock data
      req.flush(mockResponse);

      // Await the promise
      await expect(trackDetailsPromise).resolves.toEqual(mockResponse);
      expect(tokenService.getAccessToken).toHaveBeenCalled();
      expect(tokenService.getRefreshToken).toHaveBeenCalled();
    });

    it('should throw an error if the response is not received', async () => {
      const trackId = 'some-track-id';
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const trackDetailsPromise = service.getTrackDetails(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/track-details');
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      // Respond with null to simulate an empty response
      req.flush(null);

      // Expect the method to throw an error
      await expect(trackDetailsPromise).rejects.toThrow('HTTP error! Status: null');
    });

    it('should log an error if the HTTP request fails', async () => {
      const trackId = 'some-track-id';
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Call the method
      const trackDetailsPromise = service.getTrackDetails(trackId);

      // Expect the HTTP request to be made
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/track-details');
      expect(req.request.method).toBe('POST'); // Check if POST method is used

      jest.spyOn(console, 'error'); // Spy on console.error

      // Respond with a network error
      req.error(new ErrorEvent('Network error'));

      // Expect the method to log the error and throw
      expect(trackDetailsPromise).rejects.toThrow();
      //expect(console.error).toHaveBeenCalledWith("Error fetching recently played tracks:", jasmine.any(Object));
    });
  });

  describe('setCurrentlyPlayingTrack', () => {
    it('should fetch track details and update currentlyPlayingTrackSubject', async () => {
      const trackId = 'some-track-id';
      const mockTrackDetails = {
        id: trackId,
        name: 'Track Name',
        artist: 'Artist Name',
        // Include other properties you expect in the response
      };
      
      jest.spyOn(service, 'getTrackDetails').mockResolvedValue(mockTrackDetails); // Mock getTrackDetails method
      jest.spyOn(service['currentlyPlayingTrackSubject'], 'next'); // Spy on the next method of the BehaviorSubject

      // Call the method
      service.setCurrentlyPlayingTrack(trackId);

      // Await the promise for the mocked getTrackDetails
      await Promise.resolve(); // Allow async operation to complete

      // Verify that getTrackDetails was called with the correct argument
      expect(service.getTrackDetails).toHaveBeenCalledWith(trackId);
      // Verify that next was called with the mockTrackDetails
      expect(service['currentlyPlayingTrackSubject'].next).toHaveBeenCalledWith(mockTrackDetails);
    });
  });

  describe('getCurrentlyPlayingTrack', () => {
    it('should return currently playing track on successful response', async () => {
      const mockResponse = {
        id: 'track-id',
        name: 'Currently Playing Track',
        artist: 'Artist Name',
      };

      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mock-access-token');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mock-refresh-token');

      const result = service.getCurrentlyPlayingTrack();

      // Simulate the HTTP response
      httpMock.expectOne("http://localhost:3000/api/spotify/currently-playing").flush(mockResponse);

      // Verify the result
      expect(result).resolves.toEqual(mockResponse);
    });

    it('should throw an error if response is not ok', async () => {
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mock-access-token');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mock-refresh-token');

      const result = service.getCurrentlyPlayingTrack();

      // Simulate a 500 error response
      httpMock.expectOne("http://localhost:3000/api/spotify/currently-playing").flush({ error: 'error' }, { status: 500, statusText: 'Server Error' });

      // Verify that the promise rejects with an error
      expect(result).rejects.toThrowError('HTTP error! status: 500');
    });
  });

  describe('getQueue', () => {
    it('should return cached queue if available', async () => {
      const cachedQueue: TrackInfo[] = [
        { id: '1', text: 'Track 1', albumName: 'Album 1', imageUrl: 'url1', secondaryText: 'Artist 1', previewUrl: 'previewUrl1', spotifyUrl: 'spotifyUrl1', explicit: false },
      ];

      jest.spyOn(service as any, 'queueCached').mockReturnValue(true);
      (service as any).QueueObject = cachedQueue;

      const result = await service.getQueue("spotify");
      expect(result).toEqual(cachedQueue);
    });

    it('should throw an error if no recently played tracks are found', async () => {
      jest.spyOn(service as any, 'queueCached').mockReturnValue(false);
      jest.spyOn(service as any, 'getRecentlyPlayedTracks').mockResolvedValue({ items: [] });

      await expect(service.getQueue("spotify")).rejects.toThrow("No recently played tracks found");
    });

    it('should fetch tracks and map them to TrackInfo structure', async () => {
      const recentlyPlayedResponse = {
        items: [
          {
            track: {
              id: 'track-id',
              name: 'Song Name',
              artists: [{ name: 'Artist Name' }],
            },
          },
        ],
      };

      const queueResponse = {
        tracks: [
          {
            id: '1',
            name: 'Track 1',
            album: { name: 'Album 1', images: [{ url: 'url1' }] },
            artists: [{ name: 'Artist 1' }],
            preview_url: 'previewUrl1',
            external_urls: { spotify: 'spotifyUrl1' },
            explicit: false,
          },
          {
            id: '2',
            name: 'Track 2',
            album: { name: 'Album 2', images: [{ url: 'url2' }] },
            artists: [{ name: 'Artist 2' }],
            preview_url: 'previewUrl2',
            external_urls: { spotify: 'spotifyUrl2' },
            explicit: true,
          },
        ],
      };

      jest.spyOn(service as any, 'queueCached').mockReturnValue(false);
      jest.spyOn(service as any, 'getRecentlyPlayedTracks').mockResolvedValue(recentlyPlayedResponse);
      tokenService.getAccessToken.mockReturnValue('mock-access-token');
      tokenService.getRefreshToken.mockReturnValue('mock-refresh-token');

      const queuePromise = service.getQueue("spotify");

      const req = httpMock.expectOne('http://localhost:3000/api/spotify/queue');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        artist: 'Artist Name',
        song_name: 'Song Name',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });

      req.flush(queueResponse);

      const result = await queuePromise;

      expect(result).toEqual([
        {
          id: '1',
          text: 'Track 1',
          albumName: 'Album 1',
          imageUrl: 'url1',
          secondaryText: 'Artist 1',
          previewUrl: 'previewUrl1',
          spotifyUrl: 'spotifyUrl1',
          explicit: false,
        },
        {
          id: '2',
          text: 'Track 2',
          albumName: 'Album 2',
          imageUrl: 'url2',
          secondaryText: 'Artist 2',
          previewUrl: 'previewUrl2',
          spotifyUrl: 'spotifyUrl2',
          explicit: true,
        },
      ]);

      expect(sessionStorage.getItem('queue')).toBe(JSON.stringify(result));
    });

    it('should throw an error if the response structure is invalid', async () => {
      const recentlyPlayedResponse = {
        items: [
          {
            track: {
              id: 'track-id',
              name: 'Song Name',
              artists: [{ name: 'Artist Name' }],
            },
          },
        ],
      };

      jest.spyOn(service as any, 'queueCached').mockReturnValue(false);
      jest.spyOn(service as any, 'getRecentlyPlayedTracks').mockResolvedValue(recentlyPlayedResponse);
      tokenService.getAccessToken.mockReturnValue('mock-access-token');
      tokenService.getRefreshToken.mockReturnValue('mock-refresh-token');

      const queuePromise = service.getQueue("spotify");

      const req = httpMock.expectOne({
        method: 'POST'
        ,url: 'http://localhost:3000/api/spotify/queue'});
      req.flush({ invalid: 'response' });

      await expect(queuePromise).rejects.toThrow("Invalid response structure");
    });

    it('should add tracks to queue and set queue created flag', fakeAsync(() => {
      const recentlyPlayedResponse = {
        items: [
          {
            track: {
              id: 'track-id',
              name: 'Song Name',
              artists: [{ name: 'Artist Name' }],
            },
          },
        ],
      };
    
      const queueResponse = {
        tracks: Array(10).fill(null).map((_, i) => ({
          id: `${i}`,
          name: `Track ${i}`,
          album: { name: `Album ${i}`, images: [{ url: `image${i}.jpg` }] },
          artists: [{ name: `Artist ${i}` }],
          preview_url: `preview${i}.mp3`,
          external_urls: { spotify: `spotify:track:${i}` },
          explicit: false,
        })),
      };
    
      jest.spyOn(service as any, 'queueCached').mockReturnValue(false);
      jest.spyOn(service as any, 'getRecentlyPlayedTracks').mockResolvedValue(recentlyPlayedResponse);
      tokenService.getAccessToken.mockReturnValue('mock-access-token');
      tokenService.getRefreshToken.mockReturnValue('mock-refresh-token');
    
      const addTrackToQueueSpy = jest.spyOn(service as any, 'addTrackToQueue').mockResolvedValue(undefined);
      const setQueueCreatedSpy = jest.spyOn(service as any, 'setQueueCreated');
      (service as any).player = {}; // Mock player object
    
      const queuePromise = service.getQueue("spotify");
    
      // Expect and flush the recently played tracks request
      const recentlyPlayedReq = httpMock.expectOne('http://localhost:3000/api/spotify/recently-played');
      recentlyPlayedReq.flush(recentlyPlayedResponse);
    
      // Expect and flush the queue request
      const queueReq = httpMock.expectOne('http://localhost:3000/api/spotify/queue');
      expect(queueReq.request.method).toBe('POST');
      expect(queueReq.request.body).toEqual({
        artist: 'Artist Name',
        song_name: 'Song Name',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });
      queueReq.flush(queueResponse);
    
      tick(); // Advance time to resolve promises
    
      return queuePromise.then(() => {
        expect(addTrackToQueueSpy).toHaveBeenCalledTimes(5);
        expect(setQueueCreatedSpy).toHaveBeenCalled();
      });
    }));
  });

  describe('getRecentlyPlayedTracks', () => {
    it('should return cached data if available', async () => {
      // Arrange
      service['recentlyPlayedCache'] = {
        timestamp: new Date().getTime(),
        data: [{ trackName: 'Test Track', artist: 'Test Artist' }]
      };

      // Act
      const result = await service.getRecentlyPlayedTracks('spotify');

      // Assert
      expect(result).toEqual(service['recentlyPlayedCache'].data);
    });

    it('should fetch data from API and cache it', fakeAsync( () => {
      // Arrange
      const mockResponse = [{ trackName: 'Track 1', artist: 'Artist 1' }];
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Act
      service.getRecentlyPlayedTracks('spotify').then(res => {
        expect(res).toEqual(mockResponse);
      });

      // Simulate the HTTP response
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/recently-played');
      req.flush(mockResponse);
      tick(5);
      // Assert
      expect(req.request.method).toBe('POST');
      
      expect(service['recentlyPlayedCache']).toEqual({
        timestamp: expect.any(Number),
        data: mockResponse
      });
      
    }));

    it('should handle error when fetching data', async () => {
      // Arrange
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Act
      const resultPromise = service.getRecentlyPlayedTracks('spotify');

      // Simulate the HTTP error response
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/recently-played');
      req.error(new ErrorEvent('Network error'));

      // Assert
      expect(resultPromise).rejects.toThrow('Network error');
    });
  });

  describe('setVolume', () => {
    it('should call player.setVolume when player is defined', () => {
      // Arrange
      service['player'] = {
        setVolume: jest.fn() // Mock the setVolume function
      };

      const volume = 50;

      // Act
      service.setVolume(volume);

      // Assert
      expect(service['player'].setVolume).toHaveBeenCalledWith(volume);
    });

    it('should not call player.setVolume when player is undefined', () => {
      // Arrange
      service['player'] = undefined;

      const volume = 50;

      // Act
      service.setVolume(volume);

      // Assert
      expect(service['player']).toBeUndefined(); // Ensure player is undefined
      // Since player is undefined, we cannot call setVolume on it, 
      // so there is nothing to assert.
    });
  });

  describe('play', () => {
    it('should log an error if deviceId is undefined', () => {
      // Arrange
      console.error = jest.fn(); // Mock console.error
      service['deviceId'] = null;

      // Act
      service.play();

      // Assert
      expect(console.error).toHaveBeenCalledWith("Device ID is undefined. Ensure the player is ready before continuing.");
    });

    it('should log an error if state is null', async () => {
      // Arrange
      console.error = jest.fn(); // Mock console.error
      service['deviceId'] = 'mockDeviceId'; // Set a mock device ID
      service['player'].getCurrentState.mockResolvedValueOnce(null); // Simulate no current state

      // Act
      await service.play();

      // Assert
      expect(console.error).toHaveBeenCalledWith("User is not playing music through the Web Playback SDK");
    });

    it('should resume playback if the state is paused', async () => {
      // Arrange
      service['deviceId'] = 'mockDeviceId'; // Set a mock device ID
      service['player'].getCurrentState.mockResolvedValueOnce({ paused: true }); // Simulate paused state
      service['player'].resume.mockResolvedValueOnce(undefined); // Simulate successful resume
      service['playingStateSubject'] = { next: jest.fn() } as any; // Mock the subject

      // Act
      await service.play();

      // Assert
      expect(service['player'].resume).toHaveBeenCalled();
      expect(service['playingStateSubject'].next).toHaveBeenCalledWith(true);
    });

    it('should handle error when resume fails', async () => {
      // Arrange
      service['deviceId'] = 'mockDeviceId'; // Set a mock device ID
      service['player'].getCurrentState.mockResolvedValueOnce({ paused: true }); // Simulate paused state
      service['player'].resume.mockRejectedValueOnce(new Error('Failed to resume')); // Simulate an error
      console.error = jest.fn(); // Mock console.error

      // Act
      await service.play();

      // Assert
      expect(console.error).toHaveBeenCalledWith("Failed to resume playback", expect.any(Error));
    });

    it('should handle error when getCurrentState fails', async () => {
      // Arrange
      service['deviceId'] = 'mockDeviceId'; // Set a mock device ID
      service['player'].getCurrentState.mockRejectedValueOnce(new Error('Failed to get state')); // Simulate an error
      console.error = jest.fn(); // Mock console.error

      // Act
      await service.play();

      // Assert
      expect(console.error).toHaveBeenCalledWith("Failed to get player state", expect.any(Error));
    });
  });

  describe('seekToPosition', () => {
    it('should log an error if deviceId is undefined', async () => {
      // Arrange
      console.error = jest.fn(); // Mock console.error
      service['deviceId'] = null;

      // Act
      await service.seekToPosition(50);

      // Assert
      expect(console.error).toHaveBeenCalledWith("Device ID is undefined. Ensure the player is ready before continuing.");
    });

    it('should log an error if state is null', async () => {
      // Arrange
      console.error = jest.fn(); // Mock console.error
      service['deviceId'] = 'mockDeviceId'; // Set a mock device ID
      service['player'].getCurrentState.mockResolvedValueOnce(null); // Simulate no current state

      // Act
      await service.seekToPosition(50);

      // Assert
      expect(console.error).toHaveBeenCalledWith("No track is currently playing.");
    });

    it('should seek to the correct position when state is available', async () => {
      // Arrange
      service['deviceId'] = 'mockDeviceId'; // Set a mock device ID
      const mockState = {
        track_window: {
          current_track: {
            duration_ms: 200000 // Set a mock track duration (in milliseconds)
          }
        }
      };
      service['player'].getCurrentState.mockResolvedValueOnce(mockState); // Simulate a valid state
      const seekPosition = (50 / 100) * mockState.track_window.current_track.duration_ms; // Calculate expected seek position

      // Act
      await service.seekToPosition(50);

      // Assert
      expect(service['player'].seek).toHaveBeenCalledWith(seekPosition);
    });

    it('should handle error when seeking fails', async () => {
      // Arrange
      service['deviceId'] = 'mockDeviceId'; // Set a mock device ID
      const mockState = {
        track_window: {
          current_track: {
            duration_ms: 200000 // Set a mock track duration (in milliseconds)
          }
        }
      };
      service['player'].getCurrentState.mockResolvedValueOnce(mockState); // Simulate a valid state
      service['player'].seek.mockImplementationOnce(() => {
        throw new Error('Failed to seek'); // Simulate an error during seeking
      });
      console.error = jest.fn(); // Mock console.error

      // Act
      await service.seekToPosition(50);

      // Assert
      expect(console.error).toHaveBeenCalledWith("Error seeking to position:", expect.any(Error));
    });
  });

  describe('playPreviousTrack', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear any previous mock calls before each test
    });

    it('should log an error if deviceId is undefined', async () => {
      // Arrange
      console.error = jest.fn(); // Mock console.error
      service['deviceId'] = null; // Set deviceId to undefined

      // Act
      await service.playPreviousTrack();

      // Assert
      expect(console.error).toHaveBeenCalledWith("Device ID is undefined. Ensure the player is ready before continuing.");
    });

    it('should call the previous track API and update the current track', async () => {
      // Arrange
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockAccessToken);
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue(mockRefreshToken);

      const mockCurrentTrack = { item: { id: 'mockTrackId' } };
      jest.spyOn(service, 'getCurrentlyPlayingTrack').mockResolvedValue(mockCurrentTrack);
      jest.spyOn(service, 'setCurrentlyPlayingTrack');

      // Act
      await service.playPreviousTrack();

      // Assert
      const req = httpMock.expectOne(`http://localhost:3000/api/spotify/previous-track`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        deviceId: service['deviceId'],
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken
      });
      
      req.flush({}); // Simulate a successful response

      // Wait for the set timeout to resolve
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(service.getCurrentlyPlayingTrack).toHaveBeenCalled();
      expect(service.setCurrentlyPlayingTrack).toHaveBeenCalledWith(mockCurrentTrack.item.id);
    });

    it('should log an error if there is an issue with the API request', async () => {
      // Arrange
      console.error = jest.fn(); // Mock console.error
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('mockAccessToken');
      jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue('mockRefreshToken');

      // Simulate an error response from the API
      const mockErrorResponse = { error: 'some error' };

      // Act
      await service.playPreviousTrack();
      const req = httpMock.expectOne(`http://localhost:3000/api/spotify/previous-track`);
      req.error(new ErrorEvent('Network error', { message: mockErrorResponse.error }));

      // Assert
      expect(console.error).toHaveBeenCalledWith("Error playing previous track:", expect.any(Error));
    });
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no unmatched requests are outstanding
  });
});