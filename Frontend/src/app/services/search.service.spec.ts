import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService, Track } from './search.service';
import { TokenService } from './token.service';
import { BehaviorSubject, of } from 'rxjs';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    const tokenServiceMock = {
      getAccessToken: jest.fn().mockReturnValue('mockAccessToken'),
      getRefreshToken: jest.fn().mockReturnValue('mockRefreshToken')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchService,
        { provide: TokenService, useValue: tokenServiceMock }
      ]
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });
/*
  afterEach(() => {
    httpMock.verify();
  });
*/
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
});
