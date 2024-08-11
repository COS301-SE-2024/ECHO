import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from '../services/spotify.service';

describe('SpotifyController', () => {
  let controller: SpotifyController;
  let service: SpotifyService;

  const mockSpotifyService = {
    getCurrentlyPlayingTrack: jest.fn(),
    getRecentlyPlayedTracks: jest.fn(),
    getQueue: jest.fn(),
    playTrackById: jest.fn(),
    pause: jest.fn(),
    play: jest.fn(),
    setVolume: jest.fn(),
    getTrackDetails: jest.fn(),
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
  });

  describe('getRecentlyPlayedTracks', () => {
    it('should call getRecentlyPlayedTracks method of SpotifyService with correct parameters', async () => {
      const body = { accessToken: 'testAccessToken', refreshToken: 'testRefreshToken' };
      await controller.getRecentlyPlayedTracks(body);
      expect(service.getRecentlyPlayedTracks).toHaveBeenCalledWith(body.accessToken, body.refreshToken);
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

  
  
});
