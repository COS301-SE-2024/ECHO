import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { lastValueFrom, firstValueFrom, of, throwError, Observable } from 'rxjs';
import { SupabaseService } from '../../supabase/services/supabase.service';
import { SpotifyService } from './spotify.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

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

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  lastValueFrom: jest.fn(),
  firstValueFrom: jest.fn(),
  of: jest.fn(),
}));

class TestableSpotifyService extends SpotifyService {
  public async getAccessToken(accessToken: string, refreshToken: string): Promise<string> {
    return super.getAccessToken(accessToken, refreshToken);
  }

  public async getAccessKey(): Promise<string> {
    return super.getAccessKey();
  }

  public async fetchSpotifyTracks(trackIds: string, accessToken: string, refreshToken: string): Promise<any> {
    return super.fetchSpotifyTracks(trackIds, accessToken, refreshToken);
  }
}

const mockTracksResponse = {
  data: {
    items: [
      {
        id: '1',
        name: 'Track 1',
        album: { name: 'Album 1', images: [{ url: 'http://album1.jpg' }] },
        artists: [{ name: 'Artist 1' }],
        preview_url: 'http://preview1.mp3',
        external_urls: { spotify: 'http://spotify1.com' },
      },
    ],
  },
};

jest.mock('../../config', () => ({
  accessKey: 'test-access-key',
}));

describe('SpotifyService', () => {
  let service: TestableSpotifyService;
  let httpService: HttpService;
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: SpotifyService,
          useClass: TestableSpotifyService, // Override with the subclass
        },
        {
          provide: SupabaseService,
          useValue: {
            retrieveTokens: jest.fn().mockResolvedValue({ providerToken: 'mockProviderToken' }),
          },
        },
      ],
    }).compile();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  
    service = module.get<TestableSpotifyService>(SpotifyService);
    httpService = module.get<HttpService>(HttpService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
/*
  describe('getAccessToken', () => {
    it('should return the provider token', async () => {
      const result = await service['getAccessToken']('accessToken', 'refreshToken');
      expect(result).toBe('mockProviderToken');
    });
  });*/
/*
  describe('getCurrentlyPlayingTrack', () => {
    it('should return the currently playing track', async () => {
      const mockTrack = { data: { item: 'mockTrack' } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockTrack) as any);

      const result = await service.getCurrentlyPlayingTrack('accessToken', 'refreshToken');
      expect(result).toEqual({ item: 'mockTrack' });
    });
  });*/
/*
  describe('getRecentlyPlayedTracks', () => {
    it('should return recently played tracks', async () => {
      const mockTracks = { data: { items: ['track1', 'track2'] } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockTracks) as any);

      const result = await service.getRecentlyPlayedTracks('accessToken', 'refreshToken');
      expect(result).toEqual({ items: ['track1', 'track2'] });
    });
  });
*/
  describe('getQueue', () => {
/*
    it('should successfully get queue from recommendations', async () => {
      // Arrange
      const artist = 'mockArtist';
      const songName = 'mockSong';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockAccessKey = 'mockAccessKey';
      const mockResponse = {
        data: {
          recommended_songs: [
            { track: { track_uri: 'spotify:track:123456' } },
            { track: 'spotify:track:789012' }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse;
      const mockTrackDetails = [
        { id: '123456', name: 'Mock Track 1', albumName: 'Mock Album 1' },
        { id: '789012', name: 'Mock Track 2', albumName: 'Mock Album 2' }
      ];
  
      // Mock the getAccessKey method to return a fake access key
      jest.spyOn(service, 'getAccessKey').mockResolvedValue(mockAccessKey);
  
      // Mock the HTTP request to return a successful response
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));
  
      // Mock the fetchSpotifyTracks method to return track details
      jest.spyOn(service, 'fetchSpotifyTracks').mockResolvedValue(mockTrackDetails);
  
      // Act
      const result = await service.getQueue(artist, songName, accessToken, refreshToken);
  
      // Assert
      expect(service.getAccessKey).toHaveBeenCalled();
      expect(httpService.post).toHaveBeenCalledWith(
        "https://echo-interface.azurewebsites.net/api/get_recommendations",
        {
          access_key: mockAccessKey,
          artist: artist,
          song_name: songName
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      expect(service.fetchSpotifyTracks).toHaveBeenCalledWith('123456,789012', accessToken, refreshToken);
      expect(result).toEqual(mockTrackDetails);
      */
    });
  
    /*
    it('should handle errors when fetching queue', async () => {
      // Arrange
      const artist = 'mockArtist';
      const songName = 'mockSong';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockAccessKey = 'mockAccessKey';
  
      // Mock the getAccessKey method to return a fake access key
      jest.spyOn(service, 'getAccessKey').mockResolvedValue(mockAccessKey);
  
      // Mock the HTTP request to throw an error
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Network Error')));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.getQueue(artist, songName, accessToken, refreshToken)).rejects.toThrow('Network Error');
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching queue:", new Error('Network Error'));
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });
*/

/*
  describe('playTrackById', () => {
    it('should successfully play a track by ID', async () => {
      // Arrange
      const trackId = 'mockTrackId';
      const deviceId = 'mockDeviceId';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
      const mockResponse = { data: 'Track played successfully' } as AxiosResponse;
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to return a successful response
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse));
  
      // Act
      const result = await service.playTrackById(trackId, deviceId, accessToken, refreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
      expect(httpService.put).toHaveBeenCalledWith(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        { uris: [`spotify:track:${trackId}`] },
        {
          headers: {
            "Authorization": `Bearer ${mockProviderToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  
    it('should handle errors when playing a track', async () => {
      // Arrange
      const trackId = 'mockTrackId';
      const deviceId = 'mockDeviceId';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to throw an error
      jest.spyOn(httpService, 'put').mockReturnValue(throwError(() => new Error('Network Error')));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.playTrackById(trackId, deviceId, accessToken, refreshToken)).rejects.toThrow('Network Error');
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error playing track by ID:", new Error('Network Error'));
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  
    it('should handle invalid responses when playing a track', async () => {
      
      // Arrange
      const trackId = 'mockTrackId';
      const deviceId = 'mockDeviceId';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to return an invalid response
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: null } as AxiosResponse));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.playTrackById(trackId, deviceId, accessToken, refreshToken)).rejects.toThrow('Error playing track by ID');
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error playing track by ID:", new Error('Error playing track by ID'));
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });
*/
  describe('pause', () => {
    /*
    it('should pause the currently playing track', async () => {
      const mockResponse = { data: 'mockPauseResponse' };
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse) as any);

      const result = await service.pause('accessToken', 'refreshToken');
      expect(result).toEqual({"_finalizers": null, "_parentage": null, "closed": true, "destination": null, "initialTeardown": undefined, "isStopped": true});
    });*/
  });

  describe('play', () => {
    
    it('should resume the currently paused track', async () => {
      debugger;
      const mockResponse = { data: 'mockPlayResponse' };
      

      const mockObservable = {
        subscribe: jest.fn((callback) => {
          callback(mockResponse)
        }),
      };

      jest.spyOn(httpService, 'put').mockReturnValue(of(mockObservable as any));
      jest.spyOn(service, 'getAccessToken').mockReturnValueOnce('providertoken' as any);
      jest.spyOn(httpService, 'put').mockReturnValueOnce(mockObservable as any)
      const result = await service.play('accessToken', 'refreshToken');

      expect(httpService.put).toHaveBeenCalledWith(
        "https://api.spotify.com/v1/me/player/play",
        {},
        { headers: { "Authorization": `Bearer providertoken` } }
      );

      expect(result).toBeUndefined();
    });
    
  });

  describe('setVolume', () => {
  
    it('should handle errors when setting the volume', async () => {
      // Arrange
      const volume = 50;
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to throw an error
      jest.spyOn(httpService, 'put').mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockImplementationOnce((_, error) => error(new Error('Network Error')))
        }),
      } as any);
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.setVolume(volume, accessToken, refreshToken)).rejects.toThrow('response.subscribe is not a function');
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error setting volume:", expect.any(Error));
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  
    it('should throw an error if the response is invalid', async () => {
      // Arrange
      const volume = 50;
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to return an invalid response
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: null } as AxiosResponse) );
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.setVolume(volume, accessToken, refreshToken)).rejects.toThrow("Response was Invalid!");
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error setting volume:", new Error('Response was Invalid!'));
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getTrackDetails', () => {
    it('should successfully retrieve track details', async () => {
      // Arrange
      const trackID = 'mockTrackID';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
      const mockTrackData = { id: trackID, name: 'Mock Track', album: { name: 'Mock Album' } };
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to return mock track data
      jest.spyOn(httpService, 'get').mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
      } as any);
  
      (lastValueFrom as jest.Mock).mockResolvedValue({ data: mockTrackData });
  
      // Act
      const result = await service.getTrackDetails(trackID, accessToken, refreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
      expect(httpService.get).toHaveBeenCalledWith(`https://api.spotify.com/v1/tracks/${trackID}`, {
        headers: { "Authorization": `Bearer ${mockProviderToken}` }
      });
      expect(result).toEqual(mockTrackData);
    });
  
    it('should throw an error if there is an issue with the API call', async () => {
      // Arrange
      const trackID = 'mockTrackID';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to throw an error
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('Network Error');
      });
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.getTrackDetails(trackID, accessToken, refreshToken)).rejects.toThrow('Network Error');
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching track details:", new Error('Network Error'));
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  
    it('should throw an error if the response is invalid', async () => {
      // Arrange
      const trackID = 'mockTrackID';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the HTTP request to return an invalid response
      jest.spyOn(httpService, 'get').mockReturnValue(null);
  
      (lastValueFrom as jest.Mock).mockResolvedValue({ data: null });
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.getTrackDetails(trackID, accessToken, refreshToken)).rejects.toThrow('HTTP error!');
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching track details:", expect.any(Error));
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('playNextTrack', () => {
    it('should successfully skip to the next track', async () => {
      service.getAccessToken = jest.fn();
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const deviceId = 'mockDeviceId';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the response from Spotify API for successful track switch
      (firstValueFrom as jest.Mock).mockResolvedValue({ status: 204 });
  
      // Act
      const result = await service.playNextTrack(accessToken, refreshToken, deviceId);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
      expect(firstValueFrom).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: "Skipped to next track successfully" });
    });
  
    it('should throw HttpException if there is an error skipping to the next track', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const deviceId = 'mockDeviceId';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock firstValueFrom to throw an error
      (firstValueFrom as jest.Mock).mockRejectedValue(new Error('Network Error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.playNextTrack(accessToken, refreshToken, deviceId)).rejects.toThrow(
        new HttpException("Failed to play next track", HttpStatus.INTERNAL_SERVER_ERROR),
      );
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error playing next track:', 'Network Error');
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('playPreviousTrack', () => {
    it('should successfully switch to the previous track', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const deviceId = 'mockDeviceId';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the response from Spotify API for successful track switch
      (firstValueFrom as jest.Mock).mockResolvedValue({ status: 204 });
  
      // Act
      const result = await service.playPreviousTrack(accessToken, refreshToken, deviceId);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
      expect(firstValueFrom).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: "Switched to previous track successfully" });
    });
  
    it('should throw HttpException if there is an error switching tracks', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const deviceId = 'mockDeviceId';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock firstValueFrom to throw an error
      (firstValueFrom as jest.Mock).mockRejectedValue(new Error('Network Error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.playPreviousTrack(accessToken, refreshToken, deviceId)).rejects.toThrow(
        new HttpException("Failed to play next track", HttpStatus.INTERNAL_SERVER_ERROR),
      );
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error playing previous track:', 'Network Error');
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getTrackDuration', () => {
    it('should return track duration successfully', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
      const mockDurationMs = 180000; // 3 minutes
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the response from Spotify API with track duration
      const mockResponse = {
        data: {
          item: {
            duration_ms: mockDurationMs,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
  
      // Mock lastValueFrom to simulate the GET request response
      (lastValueFrom as jest.Mock).mockResolvedValue(mockResponse);
  
      // Act
      const result = await service.getTrackDuration(accessToken, refreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
      expect(lastValueFrom).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockDurationMs);
    });
  
    it('should throw HttpException if access token is missing', async () => {
      // Act & Assert
      await expect(service.getTrackDuration('', 'mockRefreshToken')).rejects.toThrow(
        new HttpException("Access token is missing while attempting to fetch track duration", HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw an error if track duration is not present in response', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the response from Spotify API with no track duration
      const mockResponse = {
        data: {
          item: {},
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
  
      // Mock lastValueFrom to simulate the GET request response
      (lastValueFrom as jest.Mock).mockResolvedValue(mockResponse);
  
      // Act & Assert
      await expect(service.getTrackDuration(accessToken, refreshToken)).rejects.toThrow(
        new Error("Error fetching track duration"),
      );
    });
  
    it('should handle errors and throw an internal server error', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue('mockProviderToken');
  
      // Mock lastValueFrom to throw an error
      (lastValueFrom as jest.Mock).mockRejectedValue(new Error('Network Error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.getTrackDuration(accessToken, refreshToken)).rejects.toThrow(
        new HttpException("Error fetching track duration", HttpStatus.INTERNAL_SERVER_ERROR),
      );
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching track duration:', 'Network Error');
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('seekToPosition', () => {
    it('should update seek position successfully', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const position_ms = 60000; // 1 minute
      const deviceId = 'mockDeviceId';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the response from Spotify API when updating seek position
      const mockResponse = {
        data: {},
        status: 204, // Status 204 indicates a successful request with no content
        statusText: 'No Content',
        headers: {},
        config: {},
      };
  
      // Mock lastValueFrom to simulate the PUT request response
      (lastValueFrom as jest.Mock).mockResolvedValue(mockResponse);
  
      // Act
      const result = await service.seekToPosition(accessToken, refreshToken, position_ms, deviceId);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
      expect(lastValueFrom).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Seek position updated successfully' });
    });
  
    it('should handle failure when updating seek position', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const position_ms = 60000; // 1 minute
      const deviceId = 'mockDeviceId';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock a response with a status other than 204 to simulate a failure
      const mockErrorResponse = {
        data: {},
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {},
      };
  
      // Mock lastValueFrom to simulate the PUT request failure
      (lastValueFrom as jest.Mock).mockResolvedValue(mockErrorResponse);
  
      // Act & Assert
      await expect(service.seekToPosition(accessToken, refreshToken, position_ms, deviceId)).rejects.toThrow(
        new HttpException('Error seeking to position', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle errors and throw an internal server error', async () => {
      // Arrange
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const position_ms = 60000; // 1 minute
      const deviceId = 'mockDeviceId';
  
      // Mock the getAccessToken method to throw an error
      jest.spyOn(service, 'getAccessToken').mockRejectedValue(new Error('Token error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.seekToPosition(accessToken, refreshToken, position_ms, deviceId)).rejects.toThrow(
        new HttpException('Error seeking to position', HttpStatus.INTERNAL_SERVER_ERROR),
      );
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error seeking to position:', 'Token error');
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('addToQueue', () => {
    it('should add a song to the queue successfully', async () => {
      // Arrange
      const uri = 'spotify:track:mockTrackId';
      const device_id = 'mockDeviceId';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock the response from Spotify API when adding to the queue
      const mockResponse = {
        data: {},
        status: 204, // Status 204 indicates a successful request with no content
        statusText: 'No Content',
        headers: {},
        config: {},
      };
  
      // Mock lastValueFrom to simulate the POST request response
      (lastValueFrom as jest.Mock).mockResolvedValue(mockResponse);
  
      // Act
      const result = await service.addToQueue(uri, device_id, accessToken, refreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
      expect(lastValueFrom).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Song added to queue successfully' });
    });
  
    it('should handle failure when adding a song to the queue', async () => {
      // Arrange
      const uri = 'spotify:track:mockTrackId';
      const device_id = 'mockDeviceId';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
      
      // Mock the getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock a response with a status other than 204 to simulate a failure
      const mockErrorResponse = {
        data: {},
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {},
      };
  
      // Mock lastValueFrom to simulate the POST request failure
      (lastValueFrom as jest.Mock).mockResolvedValue(mockErrorResponse);
  
      // Act & Assert
      expect(console.error())
      await expect(service.addToQueue(uri, device_id, accessToken, refreshToken)).rejects.toThrow(
        new HttpException('Error adding to queue.', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle errors and throw an internal server error', async () => {
      // Arrange
      const uri = 'spotify:track:mockTrackId';
      const device_id = 'mockDeviceId';
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';
  
      // Mock the getAccessToken method to throw an error
      jest.spyOn(service, 'getAccessToken').mockRejectedValue(new Error('Token error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act & Assert
      await expect(service.addToQueue(uri, device_id, accessToken, refreshToken)).rejects.toThrow(
        new HttpException('Error adding to queue.', HttpStatus.INTERNAL_SERVER_ERROR),
      );
  
      // Assert error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding to queue:', 'Token error');
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getTrackDetailsByName', () => {
    it('should fetch and return track details by name', async () => {
    // Arrange
    const artistName = 'Artist';
    const trackName = 'Track';
    const accessToken = 'mockAccessToken';
    const refreshToken = 'mockRefreshToken';
    const mockProviderToken = 'mockProviderToken';

    // Mock the exposed getAccessToken method to return a fake provider token
    jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);

    // Mock the search response from Spotify API
    const mockSearchResponse = {
      data: {
        tracks: {
          items: [
            {
              id: 'mockTrackId',
              name: 'Mock Track',
              artists: [{ name: 'Mock Artist' }],
              album: {
                name: 'Mock Album',
                images: [{ url: 'mockImageUrl' }],
              },
              external_urls: { spotify: 'mockSpotifyUrl' },
              preview_url: 'mockPreviewUrl',
            },
          ],
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    // Mock the track details response from Spotify API
    const mockTrackDetailsResponse= {
      data: {
        id: 'mockTrackId',
        name: 'Mock Track',
        artists: [{ name: 'Mock Artist' }],
        album: {
          name: 'Mock Album',
          images: [{ url: 'mockAlbumImageUrl' }],
        },
        external_urls: { spotify: 'mockTrackSpotifyUrl' },
        preview_url: 'mockTrackPreviewUrl',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    // Mock lastValueFrom to simulate responses for the search and track details
    (lastValueFrom as jest.Mock)
      .mockResolvedValueOnce(mockSearchResponse) // First call - search response
      .mockResolvedValueOnce(mockTrackDetailsResponse); // Second call - track details response

    // Act
    const result = await service.getTrackDetailsByName(
      artistName,
      trackName,
      accessToken,
      refreshToken,
    );

    // Assert
    expect(service.getAccessToken).toHaveBeenCalledWith(accessToken, refreshToken);
    expect(lastValueFrom).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      id: 'mockTrackId',
      name: 'Mock Track',
      albumName: 'Mock Album',
      albumImageUrl: 'mockAlbumImageUrl',
      artistName: 'Mock Artist',
      previewUrl: 'mockTrackPreviewUrl',
      spotifyUrl: 'mockTrackSpotifyUrl',
    });
  });

  it('should handle errors gracefully and throw the error', async () => {
    // Arrange
    const artistName = 'Artist';
    const trackName = 'Track';
    const accessToken = 'mockAccessToken';
    const refreshToken = 'mockRefreshToken';

    // Mock the exposed getAccessToken method to throw an error
    jest.spyOn(service, 'getAccessToken').mockRejectedValue(new Error('Token error'));

    // Mock console.error to suppress error logs in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act & Assert
    await expect(
      service.getTrackDetailsByName(artistName, trackName, accessToken, refreshToken),
    ).rejects.toThrow('Token error');

    // Assert error handling
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching track details:', expect.any(Error));

    // Clean up
    consoleErrorSpy.mockRestore();
  });
  });


  describe('getTrackAnalyisis', () => {
    it('should fetch and return track analysis', async () => {
      // Arrange
      const mockTrackId = 'mockTrackId';
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the exposed getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock lastValueFrom to return a fake response
      (lastValueFrom as jest.Mock).mockResolvedValue({
        data: {
          valence: 0.5,
          energy: 0.7,
          danceability: 0.8,
          tempo: 120,
        },
      });
  
      // Act
      const result = await service.getTrackAnalysis(mockTrackId, mockAccessToken, mockRefreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(mockAccessToken, mockRefreshToken);
      expect(lastValueFrom).toHaveBeenCalledWith(expect.anything());
      expect(result).toEqual({
        valence: 0.5,
        energy: 0.7,
        danceability: 0.8,
        tempo: 120,
      });
    });
  
    it('should handle errors gracefully', async () => {
      // Arrange
      const mockTrackId = 'mockTrackId';
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
  
      // Mock the exposed getAccessToken method to throw an error
      jest.spyOn(service, 'getAccessToken').mockRejectedValue(new Error('Token error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act
      const result = await service.getTrackAnalysis(mockTrackId, mockAccessToken, mockRefreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(mockAccessToken, mockRefreshToken);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching track analysis:', expect.any(Error));
      expect(result).toBeUndefined();
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getTopTracks', () => {
    it('should fetch and return top tracks', async () => {
      // Arrange
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
  
      // Mock the exposed getAccessToken method to return a fake provider token
      jest.spyOn(service, 'getAccessToken').mockResolvedValue(mockProviderToken);
  
      // Mock lastValueFrom to return a fake response
      (lastValueFrom as jest.Mock).mockResolvedValue({
        data: {
          items: [
            {
              id: '1',
              name: 'Track 1',
              album: {
                name: 'Album 1',
                images: [{ url: 'http://album1.image.url' }],
              },
              artists: [{ name: 'Artist 1' }],
              preview_url: 'http://preview1.url',
              external_urls: { spotify: 'http://spotify.url/track1' },
            },
            {
              id: '2',
              name: 'Track 2',
              album: {
                name: 'Album 2',
                images: [{ url: 'http://album2.image.url' }],
              },
              artists: [{ name: 'Artist 2' }],
              preview_url: 'http://preview2.url',
              external_urls: { spotify: 'http://spotify.url/track2' },
            },
          ],
        },
      });
  
      // Act
      const result = await service.getTopTracks(mockAccessToken, mockRefreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(mockAccessToken, mockRefreshToken);
      expect(lastValueFrom).toHaveBeenCalledWith(expect.anything());
      expect(result).toEqual([
        {
          id: '1',
          name: 'Track 1',
          albumName: 'Album 1',
          albumImageUrl: 'http://album1.image.url',
          artistName: 'Artist 1',
          previewUrl: 'http://preview1.url',
          spotifyUrl: 'http://spotify.url/track1',
        },
        {
          id: '2',
          name: 'Track 2',
          albumName: 'Album 2',
          albumImageUrl: 'http://album2.image.url',
          artistName: 'Artist 2',
          previewUrl: 'http://preview2.url',
          spotifyUrl: 'http://spotify.url/track2',
        },
      ]);
    });
  
    it('should handle errors gracefully', async () => {
      // Arrange
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
  
      // Mock the exposed getAccessToken method to throw an error
      jest.spyOn(service, 'getAccessToken').mockRejectedValue(new Error('Token error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act
      const result = await service.getTopTracks(mockAccessToken, mockRefreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(mockAccessToken, mockRefreshToken);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching top tracks:', expect.any(Error));
      expect(result).toBeUndefined();
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getTopArtists', () => {
    it('should retrieve top artists', async () => {
      service.getAccessToken = jest.fn();
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      const mockProviderToken = 'mockProviderToken';
      (lastValueFrom as jest.Mock).mockResolvedValue(
        {
          data: {
            items: [
            {
              id: '1',
              name: 'Artist 1',
              images: [{ url: 'http://image1.url' }],
              uri: 'spotify:artist:1',
            },
            {
              id: '2',
              name: 'Artist 2',
              images: [{ url: 'http://image2.url' }],
              uri: 'spotify:artist:2',
            },
          ]
          }
        }
      );

      const result = await service.getTopArtists(mockAccessToken, mockRefreshToken);

      expect(service.getAccessToken).toHaveBeenCalledWith(mockAccessToken, mockRefreshToken);
      expect(lastValueFrom).toHaveBeenCalledWith(
        expect.anything() // You can specify the exact expected call if needed
      );
      expect(result).toEqual([
        { id: '1', name: 'Artist 1', imageUrl: 'http://image1.url', spotifyUrl: 'spotify:artist:1' },
        { id: '2', name: 'Artist 2', imageUrl: 'http://image2.url', spotifyUrl: 'spotify:artist:2' },
      ]);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
  
      // Mock the exposed getAccessToken method to throw an error
      jest.spyOn(service, 'getAccessToken').mockRejectedValue(new Error('Token error'));
  
      // Mock console.error to suppress error logs in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Act
      const result = await service.getTopArtists(mockAccessToken, mockRefreshToken);
  
      // Assert
      expect(service.getAccessToken).toHaveBeenCalledWith(mockAccessToken, mockRefreshToken);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching top artists:', expect.any(Error));
      expect(result).toBeUndefined();
  
      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });
});
