import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodComponent } from './mood.component';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from '../../services/mood-service.service';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { ProviderService } from '../../services/provider.service';
import { YouTubeService } from '../../services/youtube.service';
import { SpotifyService } from '../../services/spotify.service';
import { of } from 'rxjs';

describe('MoodComponent', () => {
  let component: MoodComponent;
  let fixture: ComponentFixture<MoodComponent>;
  let screenSizeService: ScreenSizeService;
  let moodService: MoodService;
  let searchService: SearchService;
  let router: Router;
  let providerService: ProviderService;
  let youtubeService: YouTubeService;
  let spotifyService: SpotifyService;

  beforeEach(async () => {
    const screenSizeServiceMock = {
      screenSize$: of('large'),
    };

    const moodServiceMock = {
      getComponentMoodClasses: jest.fn().mockReturnValue({}),
      getCurrentMood: jest.fn().mockReturnValue('happy'),
      setCurrentMood: jest.fn(),
    };

    const searchServiceMock = {
      getSongsByMood: jest.fn().mockReturnValue(of([])),
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    const providerServiceMock = {
      getProviderName: jest.fn().mockReturnValue('spotify'),
    };

    const youtubeServiceMock = {
      getTrackByName: jest.fn().mockResolvedValue({ id: 'youtube-track-id' }),
      playTrackById: jest.fn().mockResolvedValue(undefined),
    };

    const spotifyServiceMock = {
      getTrackDetailsByName: jest.fn().mockResolvedValue({ id: 'spotify-track-id' }),
      playTrackById: jest.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [MoodComponent],
      providers: [
        { provide: ScreenSizeService, useValue: screenSizeServiceMock },
        { provide: MoodService, useValue: moodServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: YouTubeService, useValue: youtubeServiceMock },
        { provide: SpotifyService, useValue: spotifyServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodComponent);
    component = fixture.componentInstance;
    screenSizeService = TestBed.inject(ScreenSizeService);
    moodService = TestBed.inject(MoodService);
    searchService = TestBed.inject(SearchService);
    router = TestBed.inject(Router);
    providerService = TestBed.inject(ProviderService);
    youtubeService = TestBed.inject(YouTubeService);
    spotifyService = TestBed.inject(SpotifyService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to screenSizeService on init', () => {
    component.ngOnInit();
    expect(component.screenSize).toBe('large');
  });
/*
  it('should change mood and fetch tracks', () => {
    const newMood = 'sad';
    const mockTracks = [
      { name: 'Track 1', artistName: 'Artist 1', albumImageUrl: 'image1.jpg' },
      { name: 'Track 2', artistName: 'Artist 2', albumImageUrl: 'image2.jpg' },
    ];
    jest.spyOn(searchService, 'getSongsByMood').mockReturnValue(of(mockTracks));

    component.changeMood(newMood);

    expect(moodService.setCurrentMood).toHaveBeenCalledWith(newMood);
    expect(component.title).toBe(newMood);
    expect(component.albums).toEqual([
      { title: 'Track 1', artist: 'Artist 1', imageUrl: 'image1.jpg' },
      { title: 'Track 2', artist: 'Artist 2', imageUrl: 'image2.jpg' },
    ]);
  });*/

  it('should navigate to search on searchdown', () => {
    const subject = 'new search query';
    component.onSearchdown(subject);
    expect(component.searchQuery).toBe(subject);
    expect(component.title).toBe('Search');
    expect(router.navigate).toHaveBeenCalledWith(['/home'], { fragment: 'search' });
  });

  it('should navigate to profile', () => {
    component.profile();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should play track on Spotify', async () => {
    const title = 'Track Title';
    const artist = 'Artist Name';

    await component.playTrack(title, artist);
    expect(providerService.getProviderName).toHaveBeenCalled();
    expect(spotifyService.getTrackDetailsByName).toHaveBeenCalledWith(title, artist);
    expect(spotifyService.playTrackById).toHaveBeenCalledWith('spotify-track-id');
  });

  it('should play track on YouTube', async () => {
    // Change the provider to YouTube
    jest.spyOn(providerService, 'getProviderName').mockReturnValue('youtube');

    const title = 'Another Track Title';
    const artist = 'Another Artist';

    await component.playTrack(title, artist);
    expect(providerService.getProviderName).toHaveBeenCalled();
    expect(youtubeService.getTrackByName).toHaveBeenCalledWith(title, artist);
    expect(youtubeService.playTrackById).toHaveBeenCalledWith('youtube-track-id');
  });
});
