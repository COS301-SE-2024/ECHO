import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { SpotifyService } from '../../services/spotify.service';
import { ProviderService } from '../../services/provider.service';
import { MoodService } from '../../services/mood-service.service';
import { ProfileComponent } from './profile.component';

const authServiceMock = (): jest.Mocked<AuthService> => ({
    currentUser: jest.fn().mockReturnValue(of({
      user: {
        user_metadata: { name: 'mockname', username: 'Test User', picture: 'path/to/picture' }
      }
    }))
  }) as any;

  // Mock Router
  const routerMock = (): jest.Mocked<Router> => ({
    navigate: jest.fn()
  }) as any;

  // Mock MatDialog
  const matDialogMock = (): jest.Mocked<MatDialog> => ({
    open: jest.fn()
  }) as any;

  // Mock ScreenSizeService
  const screenSizeServiceMock = (): jest.Mocked<ScreenSizeService> => ({
    screenSize$: of('large')
  }) as any;

  // Mock SpotifyService
  const spotifyServiceMock = (): jest.Mocked<SpotifyService> => ({
    getTopTracks: jest.fn().mockResolvedValue([
      { id: '1', text: 'Track 1', albumName: 'Album 1', imageUrl: '', secondaryText: '', previewUrl: '', spotifyUrl: '', explicit: false }
    ]),
    getTopArtists: jest.fn().mockResolvedValue([
      { id: '1', name: 'Artist 1', imageUrl: '', spotifyUrl: '' }
    ]),
    playTrackById: jest.fn()
  }) as any;

  // Mock ProviderService
  const providerServiceMock = (): jest.Mocked<ProviderService> => ({
    getProviderName: jest.fn().mockReturnValue('spotify')
  }) as any;

  // Mock MoodService
  const moodServiceMock = (): jest.Mocked<MoodService> => ({
    getCurrentMood: jest.fn().mockReturnValue('happy'),
    getComponentMoodClasses: jest.fn().mockReturnValue({
      happy: 'happy-class',
      sad: 'sad-class'
    })
  }) as any;

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let matDialog: jest.Mocked<MatDialog>;
  let screenSizeService: jest.Mocked<ScreenSizeService>;
  let spotifyService: jest.Mocked<SpotifyService>;
  let providerService: jest.Mocked<ProviderService>;
  let moodService: jest.Mocked<MoodService>;

  beforeEach(async () => {
    authService = authServiceMock();
    router = routerMock();
    matDialog = matDialogMock();
    screenSizeService = screenSizeServiceMock();
    spotifyService = spotifyServiceMock();
    providerService = providerServiceMock();
    moodService = moodServiceMock();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: matDialog },
        { provide: ScreenSizeService, useValue: screenSizeService },
        { provide: SpotifyService, useValue: spotifyService },
        { provide: ProviderService, useValue: providerService },
        { provide: MoodService, useValue: moodService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on ngAfterViewInit if provider is Spotify', () => {
    component.ngAfterViewInit();
    expect(authService.currentUser).toHaveBeenCalled();
    expect(component.username).toEqual('mockname');
    expect(component.imgpath).toEqual('path/to/picture');
    expect(spotifyService.getTopTracks).toHaveBeenCalled();
    expect(spotifyService.getTopArtists).toHaveBeenCalled();
  });

  it('should navigate to /settings when settings is called', () => {
    component.settings();
    expect(router.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('should play the track by id', () => {
    const trackId = '1';
    component.playTrack(trackId);
    expect(spotifyService.playTrackById).toHaveBeenCalledWith(trackId);
  });

  it('should subscribe to screenSize on ngOnInit', () => {
    component.ngOnInit();
    expect(component.screenSize).toBe('large');
  });

  it('should update username on refresh if provider is Spotify', fakeAsync(() => {
    providerService.getProviderName.mockReturnValue('spotify');
    component.refresh();
    tick();
    expect(authService.currentUser).toHaveBeenCalled();
    expect(component.username).toEqual('Test User');
  }));
});
