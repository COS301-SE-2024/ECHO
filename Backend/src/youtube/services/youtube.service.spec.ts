import { Test, TestingModule } from '@nestjs/testing';
import { YouTubeService, TrackInfo } from './youtube.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('YouTubeService', () => {
  let service: YouTubeService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YouTubeService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<YouTubeService>(YouTubeService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mapYouTubeResponseToTrackInfo', () => {
    it('should map YouTube API response to TrackInfo', () => {
      const youtubeResponse = {
        id: { videoId: '123' },
        snippet: {
          title: 'Test Video',
          album: 'Test Album',
          thumbnails: { high: { url: 'https://example.com/image.jpg' } },
          channelTitle: 'Test Artist',
        },
      };

      const expected: TrackInfo = {
        id: '123',
        name: 'Test Video',
        albumName: 'Test Album',
        albumImageUrl: 'https://example.com/image.jpg',
        artistName: 'Test Artist',
        previewUrl: '',
        youtubeId: '123',
      };

      const result = service.mapYouTubeResponseToTrackInfo(youtubeResponse);
      expect(result).toEqual(expected);
    });

    it('should default albumName to "Unknown Album" if not provided', () => {
      const youtubeResponse = {
        id: { videoId: '456' },
        snippet: {
          title: 'No Album Video',
          thumbnails: { high: { url: 'https://example.com/noalbum.jpg' } },
          channelTitle: 'Unknown Artist',
        },
      };

      const expected: TrackInfo = {
        id: '456',
        name: 'No Album Video',
        albumName: 'Unknown Album',
        albumImageUrl: 'https://example.com/noalbum.jpg',
        artistName: 'Unknown Artist',
        previewUrl: '',
        youtubeId: '456',
      };

      const result = service.mapYouTubeResponseToTrackInfo(youtubeResponse);
      expect(result).toEqual(expected);
    });
  });

  describe('searchVideos', () => {
    it('should search for videos and return mapped results', async () => {
      const youtubeResponse = {
        data: {
          items: [
            {
              id: { videoId: '123' },
              snippet: {
                title: 'Video 1',
                thumbnails: { high: { url: 'https://example.com/vid1.jpg' } },
                channelTitle: 'Artist 1',
              },
            },
            {
              id: { videoId: '456' },
              snippet: {
                title: 'Video 2',
                thumbnails: { high: { url: 'https://example.com/vid2.jpg' } },
                channelTitle: 'Artist 2',
              },
            },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(youtubeResponse));

      const result = await service.searchVideos('test query');
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining(
          `${service['API_URL']}/search?part=snippet&q=test%20query&key=${service['API_KEY']}`
        )
      );
      expect(result).toEqual([
        {
          id: '123',
          name: 'Video 1',
          albumName: 'Unknown Album',
          albumImageUrl: 'https://example.com/vid1.jpg',
          artistName: 'Artist 1',
          previewUrl: '',
          youtubeId: '123',
        },
        {
          id: '456',
          name: 'Video 2',
          albumName: 'Unknown Album',
          albumImageUrl: 'https://example.com/vid2.jpg',
          artistName: 'Artist 2',
          previewUrl: '',
          youtubeId: '456',
        },
      ]);
    });
  });

  describe('getVideoDetails', () => {
    it('should retrieve video details and map the response', async () => {
      const youtubeResponse = {
        data: {
          items: [
            {
              id: { videoId: '789' },
              snippet: {
                title: 'Detailed Video',
                thumbnails: { high: { url: 'https://example.com/detail.jpg' } },
                channelTitle: 'Detail Artist',
              },
            },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(youtubeResponse));

      const result = await service.getVideoDetails('789');
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining(
          `${service['API_URL']}/videos?part=snippet,contentDetails,statistics&id=789&key=${service['API_KEY']}`
        )
      );
      expect(result).toEqual({
        id: '789',
        name: 'Detailed Video',
        albumName: 'Unknown Album',
        albumImageUrl: 'https://example.com/detail.jpg',
        artistName: 'Detail Artist',
        previewUrl: '',
        youtubeId: '789',
      });
    });
  });

  describe('getAPIKey', () => {
    it('should return the API key', async () => {
      const result = await service.getAPIKey();
      expect(result).toBe(process.env.YOUTUBE_KEY);
    });
  });
});
