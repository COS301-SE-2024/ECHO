import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { of } from 'rxjs';
import { SupabaseService } from '../../supabase/services/supabase.service';
import { SpotifyService } from './spotify.service';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('../../supabase/services/supabaseClient', () => ({
  createSupabaseClient: jest.fn(() => ({
    auth: {
      setSession: jest.fn(),
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
    },
  })),
}));

jest.mock('../../config', () => ({
  accessKey: 'test-access-key',
}));

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpService: HttpService;
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SpotifyService,
        {
          provide: SupabaseService,
          useValue: {
            retrieveTokens: jest.fn().mockResolvedValue({ providerToken: 'mockProviderToken' }),
          },
        },
      ],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
    httpService = module.get<HttpService>(HttpService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccessToken', () => {
    it('should return the provider token', async () => {
      const result = await service['getAccessToken']('accessToken', 'refreshToken');
      expect(result).toBe('mockProviderToken');
    });
/*
    it('should throw an HttpException if no user data is available', async () => {
      jest.spyOn(service, 'getAccessToken').mockRejectedValue(new HttpException('No user data available', HttpStatus.UNAUTHORIZED));
      await expect(service['getAccessToken']('invalidAccessToken', 'invalidRefreshToken')).rejects.toThrow(HttpException);
    });
    */
  });

  describe('getCurrentlyPlayingTrack', () => {
    it('should return the currently playing track', async () => {
      const mockTrack = { data: { item: 'mockTrack' } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockTrack) as any);

      const result = await service.getCurrentlyPlayingTrack('accessToken', 'refreshToken');
      expect(result).toEqual({ item: 'mockTrack' });
    });
  });

  describe('getRecentlyPlayedTracks', () => {
    it('should return recently played tracks', async () => {
      const mockTracks = { data: { items: ['track1', 'track2'] } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockTracks) as any);

      const result = await service.getRecentlyPlayedTracks('accessToken', 'refreshToken');
      expect(result).toEqual({ items: ['track1', 'track2'] });
    });
  });

  describe('getQueue', () => {
    it('should return recommended tracks', async () => {
      const mockResponse = { data: { recommended_tracks: [{ track_uri: 'spotify:track:1' }] } };
      const mockFetchTracks = jest.spyOn(service as any, 'fetchSpotifyTracks').mockResolvedValue(['track1']);
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse) as any);

      const result = await service.getQueue('artist', 'song_name', 'accessToken', 'refreshToken');
      expect(result).toEqual(['track1']);
      expect(mockFetchTracks).toHaveBeenCalledWith('1', 'accessToken', 'refreshToken');
    });
  });

  describe('playTrackById', () => {
    it('should play a track by ID', async () => {
      const mockResponse = { data: 'played' };
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse) as any);

      const result = await service.playTrackById('trackId', 'deviceId', 'accessToken', 'refreshToken');
      expect(result).toEqual(
        {"_finalizers": null, 
          "_parentage": null, 
          "closed": true, 
          "destination": null, 
          "initialTeardown": undefined, 
          "isStopped": true});
    });
  });

  describe('pause', () => {
    it('should pause the currently playing track', async () => {
      const mockResponse = { data: 'paused' };
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse) as any);

      const result = await service.pause('accessToken', 'refreshToken');
      expect(result).toEqual({"_finalizers": null, "_parentage": null, "closed": true, "destination": null, "initialTeardown": undefined, "isStopped": true});
    });
  });

  describe('play', () => {
    it('should play the currently paused track', async () => {
      const mockResponse = { data: 'played' };
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse) as any);

      const result = await service.play('accessToken', 'refreshToken');
      expect(result).toEqual({"_finalizers": null, "_parentage": null, "closed": true, "destination": null, "initialTeardown": undefined, "isStopped": true});
    });
  });

  describe('setVolume', () => {
    it('should set the volume', async () => {
      const mockResponse = { data: 'volumeSet' };
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse) as any);

      const result = await service.setVolume(50, 'accessToken', 'refreshToken');
      expect(result).toEqual({"_finalizers": null, "_parentage": null, "closed": true, "destination": null, "initialTeardown": undefined, "isStopped": true});
    });
  });

  describe('getTrackDetails', () => {
    it('should return track details', async () => {
      const mockTrack = { data: { id: 'trackId' } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockTrack) as any);

      const result = await service.getTrackDetails('trackId', 'accessToken', 'refreshToken');
      expect(result).toEqual({ id: 'trackId' });
    });
  });
});
