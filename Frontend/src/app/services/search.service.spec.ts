import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AlbumTrack, Artist, SearchService, Track, TrackInfo } from './search.service';
import { TokenService } from './token.service';
import { BehaviorSubject, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

const tokenServiceMock = (): jest.Mocked<TokenService> => ({
  getAccessToken: jest.fn().mockReturnValue('mockAccessToken'),
  getRefreshToken: jest.fn().mockReturnValue('mockRefreshToken')
}) as any;

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    tokenService = tokenServiceMock();

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SearchService,
        { provide: TokenService, useValue: tokenService },
        provideHttpClient(),    
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(SearchService);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpMock = httpTesting;
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store search results and update top result', () => {
    const mockTracks: Track[] = [
      { name: 'Track 1', albumName: 'Album 1', albumImageUrl: 'url1', artistName: 'Artist 1' },
      { name: 'Track 2', albumName: 'Album 2', albumImageUrl: 'url2', artistName: 'Artist 2' }
    ];

    service.storeSearch('query').subscribe((tracks) => {
      expect(tracks).toEqual(mockTracks);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/search/search');
    expect(req.request.method).toBe('POST');
    req.flush(mockTracks);

    service.getSearch().subscribe((tracks) => {
      expect(tracks).toEqual(mockTracks);
    });

    service.getTopResult().subscribe((track) => {
      expect(track).toEqual(mockTracks[0]);
    });
  });

  it('should store album search results', () => {
    const mockTracks: Track[] = [
      { name: 'Album Track 1', albumName: 'Album 1', albumImageUrl: 'url1', artistName: 'Artist 1' },
      { name: 'Album Track 2', albumName: 'Album 2', albumImageUrl: 'url2', artistName: 'Artist 2' }
    ];

    service.storeAlbumSearch('query').subscribe((tracks) => {
      expect(tracks).toEqual(mockTracks);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/search/album');
    expect(req.request.method).toBe('POST');
    req.flush(mockTracks);

    service.getAlbumSearch().subscribe((tracks) => {
      expect(tracks).toEqual(mockTracks);
    });
  });
/*
  it('should get suggested songs from the ECHO API', async () => {
    const mockResponse = {
      tracks: [
        {
          id: '1',
          name: 'Suggested Track 1',
          album: { name: 'Suggested Album 1', images: [{ url: 'url1' }] },
          artists: [{ name: 'Suggested Artist 1' }],
          preview_url: 'previewUrl1',
          external_urls: { spotify: 'spotifyUrl1' },
          explicit: true
        }
      ]
    };

    const mockTracks = [
      {
        id: '1',
        text: 'Suggested Track 1',
        albumName: 'Suggested Album 1',
        imageUrl: 'url1',
        secondaryText: 'Suggested Artist 1',
        previewUrl: 'previewUrl1',
        spotifyUrl: 'spotifyUrl1',
        explicit: true
      }
    ];

    const echoTracks = await service.echo('trackName', 'artistName');
    expect(echoTracks).toEqual(mockTracks);

    const req = httpMock.expectOne('http://localhost:3000/api/spotify/queue');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
*/
  describe('getArtistInfo', () => {
    it('should return artist information when the API returns valid data', async () => {
      const artistName = 'Some Artist';
      const mockResponse = {
        name: artistName,
        image: 'http://example.com/image.jpg',
        topTracks: [
          { name: 'Track 1', albumName: 'Album 1', albumImageUrl: 'http://example.com/album1.jpg', artistName: artistName },
          { name: 'Track 2', albumName: 'Album 2', albumImageUrl: 'http://example.com/album2.jpg', artistName: artistName }
        ],
        albums: [
          { id: '1', name: 'Track 1', albumName: 'Album 1', imageUrl: 'http://example.com/album1.jpg', artist: artistName },
          { id: '2', name: 'Track 1', albumName: 'Album 2', imageUrl: 'http://example.com/album2.jpg', artist: artistName }
        ]
      };

      const expectedArtist: Artist[] = [{
        name: artistName,
        image: 'http://example.com/image.jpg',
        topTracks: mockResponse.topTracks,
        albums: mockResponse.albums
      }];

      service.getArtistInfo(artistName).then(result => {
        expect(result).toEqual(expectedArtist);
      });

      // Assert that the result matches the expected data

      // Expect a POST request to be made to the API endpoint
      const req = httpMock.expectOne(`${service['apiUrl']}/search/album-info`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ artist: artistName });

      // Respond with mock data
      req.flush(mockResponse);
    });

    it('should throw an error when the response structure is invalid', async () => {
      const artistName = 'Invalid Artist';
      const invalidResponse = { notAlbums: [] };

      const promise = service.getArtistInfo(artistName);
      
      const req = httpMock.expectOne(`${service['apiUrl']}/search/album-info`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ artist: artistName });
      req.flush(invalidResponse);

      return expect(promise).rejects.toThrow('Invalid response structure when searching for an artist');
    });
  });

  describe('getAlbumInfo', () => {
    it('should return album tracks when the API returns valid data', async () => {
      const albumName = 'Test Album';
      const mockResponse = {
        name: albumName,
        imageUrl: 'http://example.com/album.jpg',
        artistName: 'Test Artist',
        tracks: [
          { id: '1', name: 'Track 1' },
          { id: '2', name: 'Track 2' }
        ]
      };
  
      const expectedTracks: AlbumTrack[] = [
        { id: '1', name: 'Track 1', albumName, imageUrl: 'http://example.com/album.jpg', artist: 'Test Artist' },
        { id: '2', name: 'Track 2', albumName, imageUrl: 'http://example.com/album.jpg', artist: 'Test Artist' }
      ];
  
      const result = service.getAlbumInfo(albumName);
  
      const req = httpMock.expectOne(`${service['apiUrl']}/search/album-info`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ title: albumName });
      req.flush(mockResponse);
  
      await expect(result).resolves.toEqual(expectedTracks);
    });
  
    it('should throw an error when the response structure is invalid', async () => {
      const albumName = 'Invalid Album';
      const invalidResponse = { notTracks: [] };
  
      const result = service.getAlbumInfo(albumName);
  
      const req = httpMock.expectOne(`${service['apiUrl']}/search/album-info`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ title: albumName });
      req.flush(invalidResponse);
  
      await expect(result).rejects.toThrow('Invalid response structure when searching for an album');
    });
  });

  describe('echo', () => {
    it('should return suggested tracks from the ECHO API', async () => {
      const trackName = 'Shape of You';
      const artistName = 'Ed Sheeran';
      
      // Mock response for the echo API
      const mockResponse = {
        tracks: [
          {
            id: '1',
            name: 'Shape of You',
            album: { name: '÷ (Divide)', images: [{ url: 'http://example.com/image.jpg' }] },
            artists: [{ name: 'Ed Sheeran' }],
            preview_url: 'http://example.com/preview.mp3',
            external_urls: { spotify: 'http://spotify.com/track/1' },
            explicit: false
          },
          // Add more tracks as needed
        ]
      };
  
      const expectedTracks: TrackInfo[] = [
        {
          id: '1',
          text: 'Shape of You',
          albumName: '÷ (Divide)',
          imageUrl: 'http://example.com/image.jpg',
          secondaryText: 'Ed Sheeran',
          previewUrl: 'http://example.com/preview.mp3',
          spotifyUrl: 'http://spotify.com/track/1',
          explicit: false
        },
        // Add expected tracks based on the mock response
      ];
  
      // Call the echo method
      service.echo(trackName, artistName).then(result => {
        expect(result).toEqual(expectedTracks);
      });
  
      // Expect the returned tracks to match the expected tracks
  
      // Expect a POST request to be made to the echo endpoint
      const req = httpMock.expectOne(`${service['apiUrl']}/spotify/queue`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        artist: artistName,
        song_name: trackName,
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
      });
  
      // Respond with the mock data
      req.flush(mockResponse);
    });
  
    it('should throw an error for invalid response structure', async () => {
      const trackName = 'Shape of You';
      const artistName = 'Ed Sheeran';
      
      // Call the echo method and expect it to throw an error
      const promise = service.echo(trackName, artistName);
  
      // Expect a POST request to be made to the echo endpoint
      const req = httpMock.expectOne(`${service['apiUrl']}/spotify/queue`);
      expect(req.request.method).toBe('POST');
  
      expect(promise).rejects.toThrow("Invalid response structure")
      // Respond with an invalid response structure
      req.flush({}); // Empty response
    });
  })
});
