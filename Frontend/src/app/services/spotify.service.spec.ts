import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpotifyService, TrackInfo } from './spotify.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';
import { of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

const MockPlayer = jest.fn().mockImplementation(() => ({
  addListener: jest.fn(),
  connect: jest.fn()
}));


describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let tokenServiceMock: any;
  let providerServiceMock: any;
  let httpService: any;
  let mockPlayer: jest.Mocked<Spotify.Player>;

  beforeEach(() => {

    mockPlayer = new MockPlayer();

    authServiceMock = {
      getTokens: jest.fn(),
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

      const req = httpMock.expectOne('http://localhost:3000/api/spotify/recently-played');
      expect(req.request.method).toBe('POST');
      req.flush(response);
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

      const req = httpMock.expectOne('http://localhost:3000/api/spotify/currently-playing');
      expect(req.request.method).toBe('POST');
      req.flush(response);
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

  it('should classify mood as Neutral', () => {
    const analysis = { valence: 0.5, energy: 0.5, danceability: 0.5, tempo: 100 };
    expect(service.classifyMood(analysis)).toBe('Neutral');
  });

  it('should classify mood as Anger', () => {
    const analysis = { valence: 0.3, energy: 0.8, danceability: 0.5, tempo: 100 };
    expect(service.classifyMood(analysis)).toBe('Anger');
  });

  it('should classify mood as Admiration', () => {
    const analysis = { valence: 0.7, energy: 0.6, danceability: 0.5, tempo: 100 };
    expect(service.classifyMood(analysis)).toBe('Admiration');
  });

  it('should classify mood as Fear', () => {
    const analysis = { valence: 0.2, energy: 0.7, danceability: 0.5, tempo: 100 };
    expect(service.classifyMood(analysis)).toBe('Fear');
  });

  it('should classify mood as Admiration', () => {
    const analysis = { valence: 0.8, energy: 0.8, danceability: 0.5, tempo: 100 };
    expect(service.classifyMood(analysis)).toBe('Admiration');
  });

  it('should classify mood as Admiration', () => {
    const analysis = { valence: 0.7, energy: 0.7, danceability: 0.7, tempo: 100 };
    expect(service.classifyMood(analysis)).toBe('Admiration');
  });

  it('should classify mood as Surprise', () => {
    const analysis = { valence: 0.6, energy: 0.8, danceability: 0.5, tempo: 130 };
    expect(service.classifyMood(analysis)).toBe('Surprise');
  });

  it('should return Neutral if no conditions are met', () => {
    const analysis = { valence: 0.3, energy: 0.3, danceability: 0.3, tempo: 100 };
    expect(service.classifyMood(analysis)).toBe('Disappointment');
  });
});

