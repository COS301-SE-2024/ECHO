import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { ScreenSizeService } from '../../../../services/screen-size-service.service';
import { SearchService, Track } from '../../../../services/search.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { MoodService } from '../../../../services/mood-service.service';
import { SpotifyService } from '../../../../services/spotify.service';
import { ProviderService } from '../../../../services/provider.service';
import { YouTubeService } from '../../../../services/youtube.service';
class ActivatedRouteStub {
  private queryParamsSubject = new BehaviorSubject<Params>({});
  queryParams = this.queryParamsSubject.asObservable();

  // Method to simulate query param changes
  setQueryParams(params: Params) {
    this.queryParamsSubject.next(params);
  }
}
describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let screenSizeService: ScreenSizeService;
  let searchService: SearchService;
  let router: Router;
  let moodService: MoodService;
  let spotifyService: SpotifyService;
  let providerService: ProviderService;
  let youtubeService: YouTubeService;

  beforeEach(async () => {
    const screenSizeServiceMock = {
      screenSize$: of('large'),
    };

    const searchServiceMock = {
      getSearch: jest.fn().mockReturnValue(of([])), // Mock an empty array of tracks
      getAlbumSearch: jest.fn().mockReturnValue(of([])),
      getTopResult: jest.fn().mockReturnValue(of({})),
      storeSearch: jest.fn().mockReturnValue(of(null)),
      storeAlbumSearch: jest.fn().mockReturnValue(of(null)),
    };

    const moodServiceMock = {
      getCurrentMood: jest.fn().mockReturnValue('happy'),
      getComponentMoodClasses: jest.fn().mockReturnValue({})
    };

    const providerServiceMock = {
      getProviderName: jest.fn().mockReturnValue('spotify')
    };

    const routerMock = {
      navigate: jest.fn()
    };

    const youtubeServiceMock = {
      getTrackByName: jest.fn().mockResolvedValue({ id: 'youtube-track-id' }),
      playTrackById: jest.fn().mockResolvedValue({})
    };

    const spotifyServiceMock = {
      getTrackDetailsByName: jest.fn().mockResolvedValue({ id: 'spotify-track-id' }),
      playTrackById: jest.fn().mockResolvedValue({})
    };

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: ScreenSizeService, useValue: screenSizeServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: MoodService, useValue: moodServiceMock },
        { provide: SpotifyService, useValue: spotifyServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: YouTubeService, useValue: youtubeServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    // Inject the services
    screenSizeService = TestBed.inject(ScreenSizeService);
    searchService = TestBed.inject(SearchService);
    router = TestBed.inject(Router);
    moodService = TestBed.inject(MoodService);
    spotifyService = TestBed.inject(SpotifyService);
    providerService = TestBed.inject(ProviderService);
    youtubeService = TestBed.inject(YouTubeService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set screen size on init', () => {
    component.ngOnInit();
    expect(component.screenSize).toBe('large');
  });

  it('should navigate to profile', () => {
    component.profile();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should play track using Spotify service', async () => {
    await component.playTrack('Track Name', 'Artist Name');
    expect(spotifyService.getTrackDetailsByName).toHaveBeenCalledWith('Track Name', 'Artist Name');
    expect(spotifyService.playTrackById).toHaveBeenCalledWith('spotify-track-id');
  });

  it('should play track using YouTube service if provider is YouTube', async () => {
    jest.spyOn(providerService, 'getProviderName').mockReturnValue('youtube'); // Change the provider to YouTube

    await component.playTrack('Track Name', 'Artist Name');
    expect(youtubeService.getTrackByName).toHaveBeenCalledWith('Track Name', 'Artist Name');
    expect(youtubeService.playTrackById).toHaveBeenCalledWith('youtube-track-id');
  });
});
