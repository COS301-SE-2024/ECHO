import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SearchService } from './search.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('SearchService', () => {
  let service: SearchService;
  let httpService: HttpService;

  const mockApiResponse = {
    data: [
      {
        title: 'Song Title',
        album: { title: 'Album Title', cover_big: 'Album Image URL' },
        artist: { name: 'Artist Name' }
      }
    ]
  };

  const mockTrack = {
    name: 'Song Title',
    albumName: 'Album Title',
    albumImageUrl: 'Album Image URL',
    artistName: 'Artist Name'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<SearchService>(SearchService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('searchByTitle should return an array of tracks', async () => {
    const axiosResponse: AxiosResponse = {
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
          headers: undefined
      }
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    const result = await service.searchByTitle('test title');
    expect(result).toEqual([mockTrack]);
  });

  it('searchByAlbum should return an array of tracks', async () => {
    const axiosResponse: AxiosResponse = {
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
          headers: undefined
      }
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    const result = await service.searchByAlbum('test album');
    expect(result).toEqual([mockTrack]);
  });

  it('convertApiResponseToSong should transform API response correctly', async () => {
    const result = await service.convertApiResponseToSong(mockApiResponse);
    expect(result).toEqual([mockTrack]);
  });
});
