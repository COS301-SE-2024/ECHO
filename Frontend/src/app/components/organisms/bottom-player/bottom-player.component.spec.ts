import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomPlayerComponent } from './bottom-player.component';
import { SpotifyService } from "../../../services/spotify.service";
import { AuthService } from "../../../services/auth.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, Subscription } from 'rxjs';
import { ProviderService } from '../../../services/provider.service';
import { ScreenSizeService } from '../../../services/screen-size-service.service';
import { ThemeService } from '../../../services/theme.service';

describe('BottomPlayerComponent', () => {
    let component: BottomPlayerComponent;
    let fixture: ComponentFixture<BottomPlayerComponent>;
    let themeServiceMock: jest.Mocked<ThemeService>;
    let spotifyServiceMock: jest.Mocked<SpotifyService>;
    let screenSizeServiceMock: jest.Mocked<ScreenSizeService>;
    let providerServiceMock: jest.Mocked<ProviderService>;
    
    beforeEach(async () => {

      themeServiceMock = {
        isDarkModeActive: jest.fn().mockReturnValue(false),
      } as unknown as jest.Mocked<ThemeService>;
  
      spotifyServiceMock = {
        currentlyPlayingTrack$: of(null),
        playingState$: of(false),
        playbackProgress$: of(0),
        getCurrentPlaybackState: jest.fn(),
        play: jest.fn(),
        pause: jest.fn(),
        playTrackById: jest.fn(),
        setVolume: jest.fn(),
        init: jest.fn().mockResolvedValue(null),
        disconnectPlayer: jest.fn(),
      } as unknown as jest.Mocked<SpotifyService>;
  
      screenSizeServiceMock = {
        screenSize$: of('large'),
      } as unknown as jest.Mocked<ScreenSizeService>;
  
      providerServiceMock = {
        getProviderName: jest.fn().mockReturnValue('spotify'),
        clear: jest.fn(),
      } as unknown as jest.Mocked<ProviderService>;

        await TestBed.configureTestingModule({
            imports: [BottomPlayerComponent,HttpClientTestingModule],
          providers: [
            { provide: ThemeService, useValue: themeServiceMock },
            { provide: SpotifyService, useValue: spotifyServiceMock },
            { provide: ScreenSizeService, useValue: screenSizeServiceMock },
            { provide: ProviderService, useValue: providerServiceMock },
          ],
        }).compileComponents();

        fixture = TestBed.createComponent(BottomPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize and subscribe to necessary services', async () => {
      await component.ngOnInit();
  
      //expect(screenSizeServiceMock.screenSize$.subscribe).toHaveBeenCalled();
      expect(spotifyServiceMock.init).toHaveBeenCalled();
      expect(component.screenSize).toBe('large');
    });
  
    it('should handle track subscription', () => {
      const track = {
        name: 'Song',
        artists: [{ name: 'Artist' }],
        album: { images: [{ url: 'image-url' }] },
        explicit: true,
        duration_ms: 300000,
      };
      spotifyServiceMock.currentlyPlayingTrack$ = of(track);
  
      component.ngAfterViewInit();
  
      expect(component.currentTrack.name).toBe('Song');
      expect(component.currentTrack.artist).toBe('Artist');
      expect(component.currentTrack.imageUrl).toBe('image-url');
      expect(component.currentTrack.explicit).toBe(true);
      expect(component.currentTrack.duration_ms).toBe(300000);
    });
  
    it('should handle playback progress subscription', () => {
      spotifyServiceMock.playbackProgress$ = of(50);
  
      component.ngAfterViewInit();
  
      expect(component.trackProgress).toBe(50);
    });
  
    it('should call playMusic when play is invoked', () => {
      component.playing = false;
      component.started = false;
  
      component.play();
  
      expect(spotifyServiceMock.playTrackById).toHaveBeenCalledWith('5mVfq3wn79JVdHQ7ZuLSCB');
      expect(component.started).toBe(true);
      expect(component.playing).toBe(true);
    });
  
    it('should call pauseMusic when play is invoked and playing is true', () => {
      component.playing = true;
  
      component.play();
  
      expect(spotifyServiceMock.pause).toHaveBeenCalled();
      expect(component.playing).toBe(false);
    });
  
    it('should handle volume change', () => {
      const event = { target: { value: 50 } };
      component.onVolumeChange(event);
  
      expect(spotifyServiceMock.setVolume).toHaveBeenCalledWith(0.5);
    });
  
    it('should unsubscribe from all subscriptions on destroy', () => {
      const unsubscribeSpy = jest.spyOn(Subscription.prototype, 'unsubscribe');
  
      component.ngOnDestroy();
  
      expect(spotifyServiceMock.disconnectPlayer).toHaveBeenCalled();
      expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    });
  
    it('should format time correctly', () => {
      const formattedTime = component.formatTime(125);
      expect(formattedTime).toBe('2:05');
    });
});
