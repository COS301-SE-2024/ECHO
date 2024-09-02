import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from '../services/spotify.service';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

describe('SpotifyController', () => {
  let controller: SpotifyController;
  let service: SpotifyService;

  const mockSpotifyService = {
    getCurrentlyPlayingTrack: jest.fn(),
    getRecentlyPlayedTracks:  jest.fn(),
    getQueue:                 jest.fn(),
    playTrackById:            jest.fn(),
    pause:                    jest.fn(),
    play:                     jest.fn(),
    setVolume:                jest.fn(),
    getTrackDetails:          jest.fn(),
    getTopArtists:            jest.fn(),
    getTrackAnalysis:         jest.fn(),
    getTopTracks:             jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotifyController],
      providers: [
        {
          provide: SpotifyService,
          useValue: mockSpotifyService,
        },
      ],
    }).compile();

    controller = module.get<SpotifyController>(SpotifyController);
    service = module.get<SpotifyService>(SpotifyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentlyPlayingTrack', () => {
    it('should call getCurrentlyPlayingTrack method of SpotifyService with correct parameters', async () => {
      const body = { accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.getCurrentlyPlayingTrack(body);
      expect(service.getCurrentlyPlayingTrack).toHaveBeenCalledWith(body.accessToken, body.refreshToken);
    });

    it('should throw HttpException when access token is missing', async () => {
      const accessToken = '';
      const refreshToken = 'valid-refresh-token';

      await expect(controller.getCurrentlyPlayingTrack({ accessToken, refreshToken }))
        .rejects
        .toThrow(new HttpException("Access token or refresh token is missing while attempting to retrieve the currently playing song from Spotify.", HttpStatus.UNAUTHORIZED));
    });

    it('should throw HttpException when refresh token is missing', async () => {
      const accessToken = 'valid-access-token';
      const refreshToken = '';

      await expect(controller.getCurrentlyPlayingTrack({ accessToken, refreshToken }))
        .rejects
        .toThrow(new HttpException("Access token or refresh token is missing while attempting to retrieve the currently playing song from Spotify.", HttpStatus.UNAUTHORIZED));
    });
  });

  describe('getRecentlyPlayedTracks', () => {
    it('should call getRecentlyPlayedTracks method of SpotifyService with correct parameters', async () => {
      const body = { accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.getRecentlyPlayedTracks(body);
      expect(service.getRecentlyPlayedTracks).toHaveBeenCalledWith(body.accessToken, body.refreshToken);
    });

    it('should throw UnauthorizedException when access token is missing', async () => {
      const accessToken = '';
      const refreshToken = 'valid-refresh-token';

      await expect(controller.getRecentlyPlayedTracks({ accessToken, refreshToken }))
        .rejects
        .toThrow(new UnauthorizedException("Access token or refresh token is missing while attempting to retrieve recently played songs from Spotify."));
    });

    it('should throw UnauthorizedException when refresh token is missing', async () => {
      const accessToken = 'valid-access-token';
      const refreshToken = '';

      await expect(controller.getRecentlyPlayedTracks({ accessToken, refreshToken }))
        .rejects
        .toThrow(new UnauthorizedException("Access token or refresh token is missing while attempting to retrieve recently played songs from Spotify."));
    });
  });

  describe('getQueue', () => {
    it('should call getQueue method of SpotifyService with correct parameters', async () => {
      const body = { artist: 'testArtist', song_name: 'testSong', accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.getQueue(body);
      expect(service.getQueue).toHaveBeenCalledWith(body.artist, body.song_name, body.accessToken, body.refreshToken);
    });
  });

  describe('playTrackById', () => {
    it('should call playTrackById method of SpotifyService with correct parameters', async () => {
      const body = { trackId: 'testTrackId', deviceId: 'testDeviceId', accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.playTrackById(body);
      expect(service.playTrackById).toHaveBeenCalledWith(body.trackId, body.deviceId, body.accessToken, body.refreshToken);
    });
  });

  describe('pause', () => {
    it('should call pause method of SpotifyService with correct parameters', async () => {
      const body = { accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.pause(body);
      expect(service.pause).toHaveBeenCalledWith(body.accessToken, body.refreshToken);
    });
  });

  describe('play', () => {
    it('should call play method of SpotifyService with correct parameters', async () => {
      const body = { accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.play(body);
      expect(service.play).toHaveBeenCalledWith(body.accessToken, body.refreshToken);
    });
  });

  describe('setVolume', () => {
    it('should call setVolume method of SpotifyService with correct parameters', async () => {
      const body = { volume: 50, accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.setVolume(body);
      expect(service.setVolume).toHaveBeenCalledWith(body.volume, body.accessToken, body.refreshToken);
    });
  });

  describe('getTrackDetails', () => {
    it('should call getTrackDetails method of SpotifyService with correct parameters', async () => {
      const body = { trackID: 'testTrackID', accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.getTrackDetails(body);
      expect(service.getTrackDetails).toHaveBeenCalledWith(body.trackID, body.accessToken, body.refreshToken);
    });
  });

  describe('playTrackByName', () => {
    it('should call playTrackByName method of SpotifyService with correct parameters', async () => {
      const body = { trackName: 'testTrackName', accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.playTrackByName(body);
      expect(service.getTrackDetails).toHaveBeenCalledWith(body.trackName, body.accessToken, body.refreshToken);
    });
  });

  describe('getTrackAnalysis', () => {
    it('should get track analysis', async () => {
      const body = {
        trackId:      'mockID',
        accessToken:  'mockToken',
        refreshToken: 'mockToken'
      };

      mockSpotifyService.getTrackAnalysis.mockResolvedValue('response');

      const result = await controller.getTrackAnalysis(body);

      expect(result).toEqual('response');
      expect(service.getTrackAnalysis).toHaveBeenCalled();
    });

    it('should reject with accessToken excluded', async () => {
      const body = {
        trackId:      'mockID',
        accessToken:  '',
        refreshToken: 'mockToken'
      };

      await expect(controller.getTrackAnalysis(body)).rejects.toThrow(new UnauthorizedException(
				"TrackId, access token, or refresh token is missing while attempting to retrieve track analysis from Spotify."
			));
      expect(service.getTrackAnalysis).not.toHaveBeenCalled();
    });

    it('should reject with refreshToken excluded', async () => {
      const body = {
        trackId:      'mockID',
        accessToken:  'mockToken',
        refreshToken: ''
      };

      await expect(controller.getTrackAnalysis(body)).rejects.toThrow(new UnauthorizedException(
				"TrackId, access token, or refresh token is missing while attempting to retrieve track analysis from Spotify."
			));
      expect(service.getTrackAnalysis).not.toHaveBeenCalled();
    });
  });

  describe('getTopTracks', () => {
    it('should return top tracks', async () => {
      const body = {
        accessToken:  'token',
        refreshToken: 'token'
      }

      mockSpotifyService.getTopTracks.mockResolvedValue('result')

      await expect(controller.getTopTracks(body)).resolves.toEqual('result');
      expect(service.getTopTracks).toHaveBeenCalled();
    });

    it('should reject with error when accesstoken excluded', async () => {
      const body = {
        accessToken:  '',
        refreshToken: 'token'
      }

      mockSpotifyService.getTopTracks.mockResolvedValue('result')

      await expect(controller.getTopTracks(body)).rejects.toThrow(new UnauthorizedException("Access token, or refresh token is missing while attempting to retrieve track analysis from Spotify."));
      expect(service.getTopTracks).not.toHaveBeenCalled();
    });
  });

  describe('getTopArtists', () => {
    it('should return top artists', async () => {
      const body = { 
        accessToken: 'mockToken',
        refreshToken: 'mockToken'
       };

       mockSpotifyService.getTopArtists.mockResolvedValue('thing')
       const result = await controller.getTopArtists(body);

       expect(result).toEqual('thing');
       expect(service.getTopArtists).toHaveBeenCalled();
    });

    it('should return an error when access token is excluded', async () => {
      const body = { 
        accessToken: '',
        refreshToken: 'mocktoken'
       };

      await expect(controller.getTopArtists(body)).rejects.toThrow(new UnauthorizedException(
				"Access token, or refresh token is missing while attempting to retrieve top artists from Spotify."
			));

       expect(service.getTopArtists).not.toHaveBeenCalled();
    });

    it('should return an error when refresh token is excluded', async () => {
      const body = { 
        accessToken: 'mocktoken',
        refreshToken: ''
       };

      await expect(controller.getTopArtists(body)).rejects.toThrow(new UnauthorizedException(
				"Access token, or refresh token is missing while attempting to retrieve top artists from Spotify."
			));

       expect(service.getTopArtists).not.toHaveBeenCalled();
    });
  });
});
