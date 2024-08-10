import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { YoutubeService, YouTubeTrackInfo } from './youtube.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

describe('YoutubeService', () => {
  let service: YoutubeService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [YoutubeService],
    }).compile();

    service = module.get<YoutubeService>(YoutubeService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQueue', () => {
    
    it('should return YouTubeTrackInfo array on successful fetch', async () => {
      const artist = 'Artist';
      const songName = 'SongName';
      const mockEchoResponse: AxiosResponse<any> = {
        data: {
          recommended_tracks: [
            { track_details: ['Track1', 'Artist1'] },
            { track_details: ['Track2', 'Artist2'] },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: undefined
        },
      };
      const mockYoutubeResponse: AxiosResponse<any> = {
        data: {
          items: [
            {
              id: 'videoId1',
              snippet: {
                title: 'Track1',
                thumbnails: { default: { url: 'url1' } },
                channelTitle: 'Channel1',
              },
            },
            {
              id: 'videoId2',
              snippet: {
                title: 'Track2',
                thumbnails: { default: { url: 'url2' } },
                channelTitle: 'Channel2',
              },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: undefined
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(mockEchoResponse));
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockYoutubeResponse));

      const result = await service.getQueue(artist, songName);
      expect(result).toEqual([
        {
          id: 'videoId1',
          title: 'Track1',
          thumbnailUrl: 'url1',
          channelTitle: 'Channel1',
          videoUrl: 'https://www.youtube.com/watch?v=videoId1',
        },
        {
          id: 'videoId2',
          title: 'Track2',
          thumbnailUrl: 'url2',
          channelTitle: 'Channel2',
          videoUrl: 'https://www.youtube.com/watch?v=videoId2',
        },
      ]);
    });

/*
    it('should throw an exception on error', async () => {
      const artist = 'Artist';
      const songName = 'SongName';

      jest.spyOn(httpService, 'post').mockReturnValueOnce(throwError(new Error('Echo API error')));

      await expect(service.getQueue(artist, songName)).rejects.toThrow(
        new HttpException('Failed to fetch queue', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      
    });
    */
  });

  
  describe('fetchSingleTrackDetails', () => {
    
    it('should return YouTubeTrackInfo on successful fetch', async () => {
      const videoId = 'videoId1';
      const mockYoutubeResponse: AxiosResponse<any> = {
        data: {
          items: [
            {
              id: 'videoId1',
              snippet: {
                title: 'Track1',
                thumbnails: { default: { url: 'url1' } },
                channelTitle: 'Channel1',
              },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: undefined
        },
      };
      
      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockYoutubeResponse));

      const result = await service.fetchSingleTrackDetails(videoId);
      expect(result).toEqual({
        id: 'videoId1',
        title: 'Track1',
        thumbnailUrl: 'url1',
        channelTitle: 'Channel1',
        videoUrl: 'https://www.youtube.com/watch?v=videoId1',
      });
    });
    

    it('should throw an exception on error', async () => {
      const videoId = 'videoId1';

      jest.spyOn(httpService, 'get').mockReturnValueOnce(throwError(new Error('YouTube API error')));

      await expect(service.fetchSingleTrackDetails(videoId)).rejects.toThrow(
        new HttpException('Failed to fetch YouTube track details', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
