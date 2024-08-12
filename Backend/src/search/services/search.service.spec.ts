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
        title: 'Track Title',
        album: { title: 'Album Title', cover_big: 'Album Image URL' },
        artist: { name: 'Artist Name' }
      }
    ]
  };

  const mockTrack = {
    name: 'Track Title',
    albumName: 'Album Title',
    albumImageUrl: 'Album Image URL',
    artistName: 'Artist Name'
  };

  const mockArtistApiResponse = {
    data: {
      data: [
        {
          id: 1,
          name: 'Artist Name',
          picture_big: 'Artist Image URL'
        }
      ]
    }
  };

  const mockTopTracksResponse = {
    data: [
      {
        title: 'Track Title',
        album: { title: 'Album Title', cover_big: 'Album Image URL' }
      }
    ]
  };

  const mockAlbumsResponse = {
    data: [
      {
        title: 'Album Title',
        cover_big: 'Album Image URL'
      }
    ]
  };

  const mockArtistInfo = {
    name: 'Artist Name',
    image: 'Artist Image URL',
    topTracks: [mockTrack],
    albums: [{ name: 'Album Title', imageUrl: 'Album Image URL' }]
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
      config: { headers: undefined }
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
      config: { headers: undefined }
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    const result = await service.searchByAlbum('test album');
    expect(result).toEqual([mockTrack]);
  });

  it('convertApiResponseToSong should transform API response correctly', async () => {
    const result = await service.convertApiResponseToSong(mockApiResponse);
    expect(result).toEqual([mockTrack]);
  });

/*
  it('artistSearch should return artist info when artist is found', async () => {
    const mockArtistApiResponse: AxiosResponse = {
      data: {
        data: [
          {
            id: 1,
            name: 'Artist Name',
            picture_big: 'Artist Image URL'
          }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined
      }
    };
    
    const mockTopTracksResponse: AxiosResponse = {
      data: [
        {
          title: 'Track Title',
          album: { title: 'Album Title', cover_big: 'Album Image URL' }
        }
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined
      }
    };
    
    const mockAlbumsResponse: AxiosResponse = {
      data: [
        {
          title: 'Album Title',
          cover_big: 'Album Image URL'
        }
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined
      }
    };
    

      jest.spyOn(httpService, 'get')
      .mockReturnValueOnce(of(mockArtistApiResponse)) // artist search
      .mockReturnValueOnce(of(mockArtistApiResponse)) // artist details
      .mockReturnValueOnce(of(mockTopTracksResponse)) // top tracks
      .mockReturnValueOnce(of(mockAlbumsResponse)); // albums

    const result = await service.artistSearch('Artist Name');
    expect(result).toEqual(mockArtistInfo);
  });
*/
  it('artistSearch should throw an error when artist is not found', async () => {
    const axiosResponse: AxiosResponse = {
      data: { data: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: undefined }
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    await expect(service.artistSearch('Unknown Artist')).rejects.toThrow('Artist not found');
  });

  it('searchAlbums should return album info when the album is found', async () => {
    jest.spyOn(service, 'getAlbumInfo').mockResolvedValue({
      id: 1,
      name: 'Album Title',
      imageUrl: 'Album Image URL',
      artistName: 'Artist Name',
      releaseDate: '2023-01-01',
      tracks: []
    });

    const axiosResponse: AxiosResponse = {
      data: { data: [{ id: 1 }] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: undefined }
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    const result = await service.searchAlbums('Album Title');
    expect(result).toEqual({
      id: 1,
      name: 'Album Title',
      imageUrl: 'Album Image URL',
      artistName: 'Artist Name',
      releaseDate: '2023-01-01',
      tracks: []
    });
  });

  it('searchAlbums should return null when the album is not found', async () => {
    const axiosResponse: AxiosResponse = {
      data: { data: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: undefined }
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    const result = await service.searchAlbums('Unknown Album');
    expect(result).toBeNull();
  });
/*
  it('getAlbumInfo should return album info when called with valid album ID', async () => {
    const mockAlbumResponse = {
      data: {
        id: 1,
        title: 'Album Title',
        cover_big: 'Album Image URL',
        artist: { name: 'Artist Name' },
        release_date: '2023-01-01',
        tracks: {
          data: [
            {
              id: 1,
              title: 'Track Title',
              duration: 300,
              track_position: 1,
              artist: { name: 'Artist Name' }
            }
          ]
        }
      }
    };

    const axiosResponse: AxiosResponse = {
      data: mockAlbumResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: undefined }
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    const result = await service.getAlbumInfo(1);
    expect(result).toEqual({
      id: 1,
      name: 'Album Title',
      imageUrl: 'Album Image URL',
      artistName: 'Artist Name',
      releaseDate: '2023-01-01',
      tracks: [
        {
          id: 1,
          name: 'Track Title',
          duration: 300,
          trackNumber: 1,
          artistName: 'Artist Name'
        }
      ]
    });
  });
*/
  it('convertApiResponseToAlbumInfo should transform API response to AlbumInfo correctly', () => {
    const mockAlbumData = {
      id: 1,
      title: 'Album Title',
      cover_big: 'Album Image URL',
      artist: { name: 'Artist Name' },
      release_date: '2023-01-01',
      tracks: {
        data: [
          {
            id: 1,
            title: 'Track Title',
            duration: 300,
            track_position: 1,
            artist: { name: 'Artist Name' }
          }
        ]
      }
    };

    const result = service.convertApiResponseToAlbumInfo(mockAlbumData);
    expect(result).toEqual({
      id: 1,
      name: 'Album Title',
      imageUrl: 'Album Image URL',
      artistName: 'Artist Name',
      releaseDate: '2023-01-01',
      tracks: [
        {
          id: 1,
          name: 'Track Title',
          duration: 300,
          trackNumber: 1,
          artistName: 'Artist Name'
        }
      ]
    });
  });

  it('convertApiResponseToArtistInfo should transform API responses to ArtistInfo correctly', async () => {
    const result = await service.convertApiResponseToArtistInfo(
      mockArtistApiResponse.data.data[0],
      mockTopTracksResponse,
      mockAlbumsResponse
    );
    expect(result).toEqual(mockArtistInfo);
  });
});
