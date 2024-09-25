import { Test, TestingModule } from '@nestjs/testing';
import { YouTubeController } from './youtube.controller';
import { YouTubeService } from '../services/youtube.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('YouTubeController', () => {
  let controller: YouTubeController;
  let youtubeService: YouTubeService;

  const mockYouTubeService = {
    searchVideos: jest.fn(),
    getVideoDetails: jest.fn(),
    getAPIKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YouTubeController],
      providers: [
        {
          provide: YouTubeService,
          useValue: mockYouTubeService,
        },
      ],
    }).compile();

    controller = module.get<YouTubeController>(YouTubeController);
    youtubeService = module.get<YouTubeService>(YouTubeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should throw an error if access token or refresh token is missing', async () => {
      await expect(
        controller.search({ accessToken: '', refreshToken: '', query: 'test' }),
      ).rejects.toThrow(
        new HttpException(
          'Access token or refresh token is missing while attempting to search for a song using YouTube.',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw an error if query is missing', async () => {
      await expect(
        controller.search({ accessToken: 'valid', refreshToken: 'valid', query: '' }),
      ).rejects.toThrow(
        new HttpException(
          'Query is missing while attempting to search for videos on YouTube.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should call youtubeService.searchVideos with the correct query', async () => {
      mockYouTubeService.searchVideos.mockResolvedValue(['video1', 'video2']);
      const result = await controller.search({
        accessToken: 'valid',
        refreshToken: 'valid',
        query: 'test',
      });

      expect(mockYouTubeService.searchVideos).toHaveBeenCalledWith('test');
      expect(result).toEqual(['video1', 'video2']);
    });
  });

  describe('getVideo', () => {
    it('should throw an error if access token or refresh token is missing', async () => {
      await expect(
        controller.getVideo({ accessToken: '', refreshToken: '', id: '123' }),
      ).rejects.toThrow(
        new HttpException(
          "Access token or refresh token is missing while attempting to retrieve a song's details on YouTube.",
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw an error if video ID is missing', async () => {
      await expect(
        controller.getVideo({ accessToken: 'valid', refreshToken: 'valid', id: '' }),
      ).rejects.toThrow(
        new HttpException(
          'Video ID is missing while attempting to retrieve video details from YouTube.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should call youtubeService.getVideoDetails with the correct video ID', async () => {
      mockYouTubeService.getVideoDetails.mockResolvedValue({ id: '123', title: 'Test Video' });
      const result = await controller.getVideo({
        accessToken: 'valid',
        refreshToken: 'valid',
        id: '123',
      });

      expect(mockYouTubeService.getVideoDetails).toHaveBeenCalledWith('123');
      expect(result).toEqual({ id: '123', title: 'Test Video' });
    });
  });

  describe('getKey', () => {
    it('should throw an error if access token or refresh token is missing', async () => {
      await expect(
        controller.getKey({ accessToken: '', refreshToken: '' }),
      ).rejects.toThrow(
        new HttpException(
          'Access token or refresh token is missing while attempting to retrieve a YouTube API key.',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should call youtubeService.getAPIKey', async () => {
      mockYouTubeService.getAPIKey.mockResolvedValue('API_KEY');
      const result = await controller.getKey({
        accessToken: 'valid',
        refreshToken: 'valid',
      });

      expect(mockYouTubeService.getAPIKey).toHaveBeenCalled();
      expect(result).toBe('API_KEY');
    });
  });
});
