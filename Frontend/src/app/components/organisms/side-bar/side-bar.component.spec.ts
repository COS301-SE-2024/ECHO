import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import { SpotifyService, TrackInfo } from '../../../services/spotify.service';
import { ProviderService } from '../../../services/provider.service';
import { ScreenSizeService } from '../../../services/screen-size-service.service';
import { AuthService } from '../../../services/auth.service';
import { SearchService } from '../../../services/search.service';
import { MoodService } from '../../../services/mood-service.service';
import { YouTubeService } from '../../../services/youtube.service';
import { ToastComponent } from '../../../components/organisms/toast/toast.component';
import { of, throwError } from 'rxjs';
import { MatCard } from '@angular/material/card';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { supportsScrollBehavior } from '@angular/cdk/platform';
import { provideHttpClient } from '@angular/common/http';

class MockToastComponent {
  showToast(message: string, type: "success" | "error" | "info") {
    // You can implement any additional logic you want to track calls
  }
}

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let spotifyService: any;
  let providerService: jest.Mocked<ProviderService>;
  let authService: jest.Mocked<AuthService>;
  let youtubeService: jest.Mocked<YouTubeService>;
  let toastComponent: MockToastComponent;

  beforeEach(async () => {
    jest.clearAllMocks();
    toastComponent = new MockToastComponent();
    let spotifyServiceMock = {
      getQueue: jest.fn(),
      getRecentlyPlayedTracks: jest.fn(),
      playTrackById: jest.fn(),
    };
    const providerServiceMock = {
      getProviderName: jest.fn(),
    };
    const authServiceMock = {
      getProvider: jest.fn().mockReturnValue(of('spotify')),
    };
    const youtubeServiceMock = {
      init: jest.fn(),
      playTrackById: jest.fn(),
      getTopYouTubeTracks: jest.fn().mockResolvedValue([]),
    };

    await TestBed.configureTestingModule({
      imports: [SideBarComponent],
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: YouTubeService, useValue: youtubeServiceMock },
        { provide: ToastComponent, useValue: toastComponent },
        ScreenSizeService,
        SearchService,
        MoodService,
        MatCard,
        provideHttpClient()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    providerService = TestBed.inject(ProviderService) as jest.Mocked<ProviderService>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    youtubeService = TestBed.inject(YouTubeService) as jest.Mocked<YouTubeService>;
    spotifyService = TestBed.inject(SpotifyService);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load suggestions and recently played tracks for Spotify provider', async () => {
      providerService.getProviderName.mockReturnValue('spotify');
      spotifyService.getQueue.mockResolvedValue([]);
      spotifyService.getRecentlyPlayedTracks.mockResolvedValue({ items: [] });

      await component.ngOnInit();

      expect(spotifyService.getQueue).toHaveBeenCalled();
      expect(spotifyService.getRecentlyPlayedTracks).toHaveBeenCalled();
      expect(authService.getProvider).toHaveBeenCalled();
    });

    it('should load YouTube data if the provider is YouTube', async () => {
      providerService.getProviderName.mockReturnValue('youtube');
      youtubeService.init.mockResolvedValue(undefined);

      await component.ngOnInit();

      expect(youtubeService.init).toHaveBeenCalled();
    });
  });

  describe('toggleDropdown', () => {
    it('should toggle the dropdown visibility', () => {
      component.isDropdownVisible = false;
      component.toggleDropdown();
      expect(component.isDropdownVisible).toBe(true);

      component.toggleDropdown();
      expect(component.isDropdownVisible).toBe(false);
    });
  });
/*
  describe('loadSuggestionsData', () => {
    it('should fetch and load suggestions data for Spotify provider', async () => {
      spotifyService.getQueue.mockResolvedValue({
        id: 1,
        text: "string",
        albumName: "string",
        imageUrl: "string",
        secondaryText: "string",
        previewUrl: "string",
        spotifyUrl: "string",
        explicit: true,
      } as unknown as TrackInfo);
      jest.spyOn(providerService, 'getProviderName').mockReturnValue("spotify");
      await component.loadSuggestionsData();

      expect(spotifyService.getQueue).toHaveBeenCalled();
      expect(component.suggestionsCardData).toEqual({
        id: 1,
        text: "string",
        albumName: "string",
        imageUrl: "string",
        secondaryText: "string",
        previewUrl: "string",
        spotifyUrl: "string",
        explicit: true,
      });
      expect(component.isLoading).toBe(false);
    });

    it('should show toast error on failure', async () => {
      const mockResponse = {
        id: 1,
        text: "string",
        albumName: "string",
        imageUrl: "string",
        secondaryText: "string",
        previewUrl: "string",
        spotifyUrl: "string",
        explicit: true,
      };
      spotifyService.getQueue.mockRejectedValue(new Error("No recently played tracks found"));
      component.selectOption("suggestions");
      const showToastSpy = jest.spyOn(toastComponent, 'showToast').mockImplementation((message: string | undefined, type: "success" | "error" | "info") => {
        console.log("Spy Called");
      });

      await component.loadSuggestionsData();
      
      expect(component.selectedOption).toEqual("suggestions")
      expect(showToastSpy).toHaveBeenCalled();
      expect(showToastSpy).toHaveBeenCalledWith('Error fetching suggestions data', 'error');
      expect(component.isLoading).toBe(false);
    });
  });
*/
  describe('playTrack', () => {
    it('should play track by ID using Spotify service', async () => {
      providerService.getProviderName.mockReturnValue('spotify');
      await component.playTrack('12345');

      expect(spotifyService.playTrackById).toHaveBeenCalledWith('12345');
    });

    it('should play track by ID using YouTube service if provider is YouTube', async () => {
      providerService.getProviderName.mockReturnValue('youtube');
      await component.playTrack('12345');

      expect(youtubeService.playTrackById).toHaveBeenCalledWith('12345');
    });
  });

  /*
  describe('fetchRecentlyPlayedTracks', () => {
    it('should fetch and load recently played tracks for Spotify', async () => {
      const mockTracks = {
        items: [{
          track: {
            id: '1',
            name: 'Track 1',
            album: { images: [{ url: 'url1' }] },
            artists: [{ name: 'Artist 1' }],
            explicit: false,
          }
        }]
      };
      spotifyService.getRecentlyPlayedTracks.mockResolvedValue(mockTracks);
      const fetchRecentlyPlayedTracksSpy = jest.spyOn(component as any, 'fetchRecentlyPlayedTracks');
      await (component as any).fetchRecentlyPlayedTracks();

      expect(fetchRecentlyPlayedTracksSpy).toHaveBeenCalled();
      expect(component.recentListeningCardData.length).toBe(1);
    });

    it('should show toast error on failure to fetch recently played tracks', async () => {
      spotifyService.getRecentlyPlayedTracks.mockRejectedValue(new Error('Error fetching tracks'));

      const fetchRecentlyPlayedTracksSpy = jest.spyOn(component as any, 'fetchRecentlyPlayedTracks');
      await (component as any).fetchRecentlyPlayedTracks();

      expect(fetchRecentlyPlayedTracksSpy).toHaveBeenCalled();

      expect(toastComponent.showToast).toHaveBeenCalledWith('Error fetching recently played tracks', 'error');
      expect(component.isLoading).toBe(false);
    });
  });
  */
});
