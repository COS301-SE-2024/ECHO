import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';
import { SpotifyService } from './spotify.service';
import { isPlatformBrowser } from '@angular/common';

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let tokenServiceMock: any;
  let providerServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      getTokens: jest.fn().mockReturnValue(of({ providerToken: 'fake-token' }))
    };
    tokenServiceMock = {
      getAccessToken: jest.fn().mockReturnValue('access-token'),
      getRefreshToken: jest.fn().mockReturnValue('refresh-token')
    };
    providerServiceMock = {};

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SpotifyService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(SpotifyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Caching', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('should return true if recent listening is cached', () => {
      sessionStorage.setItem('recentListening', JSON.stringify({ some: 'data' }));

      const result = service['recentListeningCached']();

      expect(result).toBe(true);
      expect(service['RecentListeningObject']).toEqual({ some: 'data' });
    });

    it('should return false if recent listening is not cached', () => {
      const result = service['recentListeningCached']();

      expect(result).toBe(false);
      expect(service['RecentListeningObject']).toBeNull();
    });

    it('should return true if queue is cached', () => {
      sessionStorage.setItem('queue', JSON.stringify({ some: 'data' }));

      const result = service['queueCached']();

      expect(result).toBe(true);
      expect(service['QueueObject']).toEqual({ some: 'data' });
    });

    it('should return false if queue is not cached', () => {
      const result = service['queueCached']();

      expect(result).toBe(false);
      expect(service['QueueObject']).toBeNull();
    });
  });

  describe('Player Control', () => {
    beforeEach(() => {
      service['player'] = {
        pause: jest.fn().mockResolvedValue(null),
        resume: jest.fn().mockResolvedValue(null),
        getCurrentState: jest.fn().mockResolvedValue({ paused: true }),
        setVolume: jest.fn().mockResolvedValue(null),
        disconnect: jest.fn().mockResolvedValue(null)
      };
      service['deviceId'] = 'device123';
    });

    it('should pause the playback', () => {
      service.pause();

      expect(service['player'].pause).toHaveBeenCalled();
      expect(service['playingStateSubject'].getValue()).toBe(false);
    });

    it('should resume the playback', async () => {
      await service.play();

      expect(service['player'].resume).toHaveBeenCalled();
      expect(service['playingStateSubject'].getValue()).toBe(true);
    });

    it('should set the volume', () => {
      service.setVolume(0.5);

      expect(service['player'].setVolume).toHaveBeenCalledWith(0.5);
    });

    it('should disconnect the player', () => {
      service.disconnectPlayer();

      expect(service['player'].disconnect).toHaveBeenCalled();
    });
  });
});
