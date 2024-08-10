import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpotifyService, TrackInfo } from './spotify.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { IterableDiffers, PLATFORM_ID, provideExperimentalCheckNoChangesForDebug } from '@angular/core';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let tokenServiceMock: any;
  let providerServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      getTokens: jest.fn(),
    };

    tokenServiceMock = {
      getAccessToken: jest.fn(),
      getRefreshToken: jest.fn(),
    };

    providerServiceMock = {
      getProvider: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SpotifyService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(SpotifyService);
    httpMock = TestBed.inject(HttpTestingController);
  });
/*
  afterEach(() => {
    httpMock.verify();
  });
*/
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
      //expect(service.loadSpotifySdk).toHaveBeenCalledWith(providerToken);
    });
  
    it('should log an error when token fetch fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Token fetch failed');
      authServiceMock.getTokens.mockReturnValue(throwError(error));
  
      await service.initializeSpotify();
  
      expect(authServiceMock.getTokens).toHaveBeenCalled();
      /*
      expect(service.loadSpotifySdk).not.toHaveBeenCalled();
      */
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching Spotify token from AuthService:', error);
  
      consoleErrorSpy.mockRestore();
    });
  });

  describe('recentListeningCached', () => {
    /*
    it('should return true if recent listening is cached', () => {
      sessionStorage.setItem('recentListening', JSON.stringify({}));

      const result: boolean = service.recentListeningCached();
      expect(result).toBe(true);
    });
*/
    it('should return false if recent listening is not cached', () => {
      sessionStorage.removeItem('recentListening');
      const result: boolean = service.recentListeningCached();
      expect(service.recentListeningCached()).toBe(false);
    });
  });

  describe('queueCached', () => {
    /*
    it('should return true if queue is cached', () => {
      sessionStorage.setItem('queue', JSON.stringify({}));

      expect(service.queueCached()).toBe(true);
    });
*/
    it('should return false if queue is not cached', () => {
      sessionStorage.removeItem('queue');

      expect(service.queueCached()).toBe(false);
    });
  });

  /*
  describe('loadSpotifySdk', () => {
    it('should create and append Spotify SDK script to the document', () => {
      const providerToken = 'provider-token';
      const scriptSpy = jest.spyOn(document, 'createElement').mockReturnValue({} as any);
      const appendSpy = jest.spyOn(document.head, 'appendChild');

      service.loadSpotifySdk(providerToken);

      expect(scriptSpy).toHaveBeenCalledWith('script');
      expect(appendSpy).toHaveBeenCalled();
    });
  });
*/
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
      //expect(service['playbackProgressSubject'].value).toBe(50);
    });
  });

  describe('pause', () => {
    it('should pause playback', () => {
      const pauseMock = jest.fn().mockResolvedValue({});
      service['player'] = {
        pause: pauseMock,
      } as any;

      service.pause();

      //expect(pauseMock).toHaveBeenCalled();
      expect(service['playingStateSubject'].value).toBe(false);
    });
  });

  /*
  describe('play', () => {
    it('should resume playback if paused', () => {
      const getCurrentStateMock = jest.fn().mockResolvedValue({ paused: true });
      const resumeMock = jest.fn().mockResolvedValue({});
      service['player'] = {
        getCurrentState: getCurrentStateMock,
        resume: resumeMock,
      } as any;

      service.play();

      //expect(getCurrentStateMock).toHaveBeenCalled();
      //expect(resumeMock).toHaveBeenCalled();
      expect(service['playingStateSubject'].value).toBe(true);
    });
  });
*/
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

      const req = httpMock.expectOne('http://localhost:3000/api/spotify/recently-played');
      expect(req.request.method).toBe('POST');
      req.flush(response);

      //expect(sessionStorage.getItem('recentListening')).toEqual(JSON.stringify(response));
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
/*
      const req = httpMock.expectOne('http://localhost:3000/api/spotify/queue');
      expect(req.request.method).toBe('POST');
      req.flush(queueResponse);
*/
/*
      expect(sessionStorage.getItem('queue')).toEqual(JSON.stringify([
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
      ]));
      */
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

      const req = httpMock.expectOne('http://localhost:3000/api/spotify/currently-playing');
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });
  });
/*
  describe('setCurrentlyPlayingTrack', () => {
    it('should update currently playing track subject', async () => {
      const track = { id: 'track1', name: 'track1' };
      jest.spyOn(service, 'getTrackDetails').mockResolvedValue(track);

      service.setCurrentlyPlayingTrack('track1');

      expect(service['currentlyPlayingTrackSubject'].value).toBe(track);
    });
    
  });
*/
  describe('truncateText', () => {
    it('should truncate text to specified length', () => {
      const text = 'this is a long text';
      const maxLength = 10;
      const truncatedText = service.truncateText(text, maxLength);

      expect(truncatedText).toBe('this is a ...');
    });

    it('should not truncate text if it is shorter than max length', () => {
      const text = 'short text';
      const maxLength = 20;
      const truncatedText = service.truncateText(text, maxLength);

      expect(truncatedText).toBe('short text');
    });
  });
});
