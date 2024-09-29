import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BottomPlayerComponent } from './bottom-player.component';
import { SpotifyService } from '../../../services/spotify.service';
import { ScreenSizeService } from '../../../services/screen-size-service.service';
import { ProviderService } from '../../../services/provider.service';
import { MoodService } from '../../../services/mood-service.service';
import { YouTubeService } from '../../../services/youtube.service';
import { AuthService } from '../../../services/auth.service';
import { of, Subscription, interval } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ElementRef, ChangeDetectorRef } from '@angular/core';

describe('BottomPlayerComponent', () => {
  let component: BottomPlayerComponent;
  let fixture: ComponentFixture<BottomPlayerComponent>;
  let spotifyService: any;
  let youtubeService: any;
  let screenSizeService: any;
  let providerService: any;
  let moodService: any;
  let authService: any;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    spotifyService = {
      currentlyPlayingTrack$: of(null),
      playingState$: of(false),
      playbackProgress$: of(0),
      play: jest.fn(),
      pause: jest.fn(),
      seekToPosition: jest.fn(),
      playNextTrack: jest.fn(),
      playPreviousTrack: jest.fn(),
      mute: jest.fn(),
      unmute: jest.fn(),
      getCurrentPlaybackState: jest.fn(),
      disconnectPlayer: jest.fn(),
      playTrackById: jest.fn(),
      setVolume: jest.fn((volume : any) => {

      }),
    };

    youtubeService = {
      currentlyPlayingTrack$: of(null),
      playingState$: of(false),
      playbackProgress$: of(0),
      mute: jest.fn(),
      unmute: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      seekToPosition: jest.fn(),
      nextTrack: jest.fn(),
      previousTrack: jest.fn(),
      getCurrentPlaybackState: jest.fn(),
      disconnectPlayer: jest.fn(),
      setVolume: jest.fn((volume : any) => {

      }),
    };

    screenSizeService = {
      screenSize$: of('desktop')
    };

    providerService = {
      getProviderName: jest.fn().mockReturnValue('spotify'),
      clear: jest.fn()
    };

    moodService = {
      getComponentMoodClasses: jest.fn().mockReturnValue({}),
      getComponentMoodClassesHover: jest.fn().mockReturnValue({}),
      getCurrentMood: jest.fn()
    };

    authService = {
      signOut: jest.fn()
    };

    cdr = { detectChanges: jest.fn() } as unknown as ChangeDetectorRef;

    await TestBed.configureTestingModule({
      imports: [BottomPlayerComponent],
      providers: [
        { provide: SpotifyService, useValue: spotifyService },
        { provide: YouTubeService, useValue: youtubeService },
        { provide: ScreenSizeService, useValue: screenSizeService },
        { provide: ProviderService, useValue: providerService },
        { provide: MoodService, useValue: moodService },
        { provide: AuthService, useValue: authService },
        { provide: ChangeDetectorRef, useValue: cdr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BottomPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to screenSize$ and set screenSize', () => {
      component.ngOnInit();
      expect(component.screenSize).toBe('desktop');
    });

    /*
    it('should detect changes if provider is Spotify', fakeAsync(() => {
      component.ngOnInit();
      tick(1000);
      expect(cdr.detectChanges).toHaveBeenCalled();
    }));*/
  });

  describe('ngAfterViewInit', () => {
    it('should subscribe to Spotify currently playing track and update currentTrack', () => {
      spotifyService.currentlyPlayingTrack$ = of({
        name: 'Song',
        artists: [{ name: 'Artist' }],
        album: { images: [{ url: 'image-url' }] },
        explicit: true,
        duration_ms: 300000
      });

      component.ngAfterViewInit();
      expect(component.currentTrack.name).toBe('Song');
      expect(component.currentTrack.artist).toBe('Artist');
      expect(component.currentTrack.imageUrl).toBe('image-url');
      expect(component.currentTrack.explicit).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call Spotify service disconnectPlayer and unsubscribe from all', () => {
      const unsubscribeSpy = jest.spyOn(component as any, 'unsubscribeAll');
      component.ngOnDestroy();
      expect(spotifyService.disconnectPlayer).toHaveBeenCalled();
      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(providerService.clear).toHaveBeenCalled();
      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  describe('mute and unmute', () => {
    it('should toggle mute state and call Spotify mute method', async () => {
      await component.mute();
      expect(component.muted).toBe(true);
      expect(spotifyService.mute).toHaveBeenCalled();

      await component.unmute();
      expect(component.muted).toBe(false);
      expect(spotifyService.unmute).toHaveBeenCalled();
    });
  });

  describe('play and pause', () => {
    /*
    it('should toggle play state and call appropriate service methods', () => {
      component.play();
      expect(spotifyService.play).toHaveBeenCalled();
      expect(component.playing).toBe(true);

      component.pauseMusic();
      expect(spotifyService.pause).toHaveBeenCalled();
      expect(component.playing).toBe(false);
    });*/
  });

  describe('playingNow', () => {
    it('should return true when playing is true', () => {
      component.playing = true; // Set playing to true
      expect(component.playingNow()).toBe(true);
    });

    it('should return false when playing is false', () => {
      component.playing = false; // Set playing to false
      expect(component.playingNow()).toBe(false);
    });
  });

  describe('pausedNow', () => {
    it('should return true when playing is false', () => {
      component.playing = false; // Set playing to false
      expect(component.pausedNow()).toBe(true);
    });

    it('should return false when playing is true', () => {
      component.playing = true; // Set playing to true
      expect(component.pausedNow()).toBe(false);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly for whole minutes', () => {
      expect(component.formatTime(120)).toBe('2:00'); // 120 seconds
    });

    it('should format time correctly for partial minutes', () => {
      expect(component.formatTime(125)).toBe('2:05'); // 125 seconds
    });

    it('should format time correctly for less than a minute', () => {
      expect(component.formatTime(59)).toBe('0:59'); // 59 seconds
    });

    it('should format time correctly for exactly one minute', () => {
      expect(component.formatTime(60)).toBe('1:00'); // 60 seconds
    });

    it('should format time correctly for zero seconds', () => {
      expect(component.formatTime(0)).toBe('0:00'); // 0 seconds
    });
  });

  describe('playNext', () => {
    it('should call playNextTrack on Spotify service when provider is Spotify', () => {
      providerService.getProviderName.mockReturnValue('spotify');

      component.playNext();

      expect(spotifyService.playNextTrack).toHaveBeenCalled();
      expect(youtubeService.nextTrack).not.toHaveBeenCalled();
    });

    it('should call nextTrack on YouTube service when provider is YouTube', () => {
      providerService.getProviderName.mockReturnValue('youtube');

      component.playNext();

      expect(youtubeService.nextTrack).toHaveBeenCalled();
      expect(spotifyService.playNextTrack).not.toHaveBeenCalled();
    });
  });

  describe('playPrevious', () => {
    it('should call playPreviousTrack on Spotify service when provider is Spotify', () => {
      providerService.getProviderName.mockReturnValue('spotify');

      component.playPrevious();

      expect(spotifyService.playPreviousTrack).toHaveBeenCalled();
      expect(youtubeService.previousTrack).not.toHaveBeenCalled();
    });

    it('should call previousTrack on YouTube service when provider is YouTube', () => {
      providerService.getProviderName.mockReturnValue('youtube');

      component.playPrevious();

      expect(youtubeService.previousTrack).toHaveBeenCalled();
      expect(spotifyService.playPreviousTrack).not.toHaveBeenCalled();
    });
  });

  describe('onVolumeChange', () => {
    it('should call setVolume on Spotify service with correct value when provider is Spotify', () => {
      providerService.getProviderName.mockReturnValue('spotify');
      const event = { target: { value: 50 } }; // Volume set to 50%

      component.onVolumeChange(event);

      expect(spotifyService.setVolume).toHaveBeenCalledWith(0.5); // 50% as 0.5
      expect(youtubeService.setVolume).not.toHaveBeenCalled();
    });

    it('should call setVolume on YouTube service with correct value when provider is YouTube', () => {
      providerService.getProviderName.mockReturnValue('youtube');
      const event = { target: { value: 75 } }; // Volume set to 75%

      component.onVolumeChange(event);

      expect(youtubeService.setVolume).toHaveBeenCalledWith(0.75); // 75% as 0.75
      expect(spotifyService.setVolume).not.toHaveBeenCalled();
    });
  });

  describe('playMusic', () => {
    it('should call play on Spotify service when provider is Spotify', () => {
      providerService.getProviderName.mockReturnValue('spotify');

      component.playMusic();

      expect(spotifyService.play).toHaveBeenCalled();
      expect(youtubeService.play).not.toHaveBeenCalled();
    });

    it('should call play on YouTube service when provider is YouTube', () => {
      providerService.getProviderName.mockReturnValue('youtube');

      component.playMusic();

      expect(youtubeService.play).toHaveBeenCalled();
      expect(spotifyService.play).not.toHaveBeenCalled();
    });
  });

  describe('pauseMusic', () => {
    it('should call pause on Spotify service when provider is Spotify', () => {
      providerService.getProviderName.mockReturnValue('spotify');

      component.pauseMusic();

      expect(spotifyService.pause).toHaveBeenCalled();
      expect(youtubeService.pause).not.toHaveBeenCalled();
    });

    it('should call pause on YouTube service when provider is YouTube', () => {
      providerService.getProviderName.mockReturnValue('youtube');

      component.pauseMusic();

      expect(youtubeService.pause).toHaveBeenCalled();
      expect(spotifyService.pause).not.toHaveBeenCalled();
    });
  });

  describe('play', () => {
    it('should call playTrackById on Spotify service when provider is Spotify and not started', () => {
      providerService.getProviderName.mockReturnValue('spotify');
      component.started = false;
      component.playing = false;

      component.play();

      expect(spotifyService.playTrackById).toHaveBeenCalledWith("5mVfq3wn79JVdHQ7ZuLSCB");
      expect(component.started).toBe(true);
      expect(component.playing).toBe(true);
    });

    it('should update state when provider is YouTube and not started', () => {
      providerService.getProviderName.mockReturnValue('youtube');
      component.started = false;
      component.playing = false;

      component.play();

      expect(component.started).toBe(true);
      expect(component.playing).toBe(true);
    });
  });
});
