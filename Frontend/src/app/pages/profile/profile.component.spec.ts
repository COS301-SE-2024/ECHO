import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { SpotifyService } from '../../services/spotify.service';
import { ProviderService } from '../../services/provider.service';
import { MoodService } from '../../services/mood-service.service';
import { of } from 'rxjs';
import { EditProfileModalComponent } from '../../components/organisms/edit-profile-modal/edit-profile-modal.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceMock: any;
  let spotifyServiceMock: any;
  let providerServiceMock: any;
  let routerMock: any;
  let dialogMock: any;
  let moodServiceMock: any;
  let screenSizeServiceMock: any;
  let dialogRefMock: Partial<MatDialogRef<EditProfileModalComponent, any>>;

  beforeEach(async () => {
    const dialogRefMock: Partial<MatDialogRef<EditProfileModalComponent, any>> = {
        afterClosed: jest.fn().mockReturnValue(of(true)),  // simulate afterClosed() returning a resolved value
        close: jest.fn(),  // mock the close method
        componentInstance: {} as EditProfileModalComponent  // mock the component instance if needed
      };
    authServiceMock = {
      currentUser: jest.fn(() => of({ user: { user_metadata: { name: 'Test User', picture: 'test-pic.jpg' }}}))
    };
    spotifyServiceMock = {
      getTopTracks: jest.fn(() => Promise.resolve([{ id: '1', text: 'Track 1', albumName: 'Album 1', imageUrl: '', secondaryText: '', previewUrl: '', spotifyUrl: '', explicit: false }])),
      getTopArtists: jest.fn(() => Promise.resolve([{ id: '1', name: 'Artist 1', imageUrl: '', spotifyUrl: '' }])),
      playTrackById: jest.fn()
    };
    providerServiceMock = { 
        getProviderName: jest.fn(() => 'spotify') 
    };
    routerMock = { navigate: jest.fn() };
    dialogMock = { 
        open: jest.fn().mockReturnValue(dialogRefMock)
    };
    moodServiceMock = { getCurrentMood: jest.fn(() => 'happy'), getComponentMoodClasses: jest.fn(() => ({})) };
    screenSizeServiceMock = { screenSize$: of('large') };

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SpotifyService, useValue: spotifyServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MoodService, useValue: moodServiceMock },
        { provide: ScreenSizeService, useValue: screenSizeServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial mood and classes from MoodService', () => {
    expect(moodServiceMock.getCurrentMood).toHaveBeenCalled();
    expect(component.currentMood).toBe('happy');
    expect(component.moodComponentClasses).toEqual({});
  });

  it('should get the provider name and user info on AfterViewInit', () => {
    component.ngAfterViewInit();

    expect(providerServiceMock.getProviderName).toHaveBeenCalled();
    expect(authServiceMock.currentUser).toHaveBeenCalled();
    expect(component.username).toBe('Test User');
    expect(component.imgpath).toBe('test-pic.jpg');
  });

  it('should load top tracks and top artists on AfterViewInit', async () => {
    await component.ngAfterViewInit();

    expect(spotifyServiceMock.getTopTracks).toHaveBeenCalled();
    expect(spotifyServiceMock.getTopArtists).toHaveBeenCalled();
    expect(component.topTracks.length).toBe(1);
    expect(component.topArtists.length).toBe(1);
  });

  it('should update screen size on subscription in ngOnInit', () => {
    component.ngOnInit();

    expect(screenSizeServiceMock.screenSize$).toBeTruthy();
    expect(component.screenSize).toBe('large');
  });

  it('should open the edit profile dialog when openDialog is called', () => {
    component['dialog'] = {
        open: jest.fn().mockReturnValue({
            afterClosed: jest.fn().mockReturnValue(of({})), // or another observable if required
        }),
    } as unknown as MatDialog;
    component.openDialog();

    expect(component['dialog'].open).toHaveBeenCalled();
  });

  it('should save image path from localStorage if present', () => {
    localStorage.setItem('path', 'new-path.jpg');
    component.save();

    expect(component.imgpath).toBe('new-path.jpg');
  });

  it('should refresh user data if provider is Spotify', () => {
    providerServiceMock.getProviderName.mockResolvedValue('spotify');
    component.refresh();

    expect(providerServiceMock.getProviderName).toHaveBeenCalled();
    expect(authServiceMock.currentUser).toHaveBeenCalled();
    expect(component.username).toBe('Test User');
  });

  it('should navigate to settings page when settings is called', () => {
    component.settings();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('should call SpotifyService to play a track when playTrack is called', () => {
    component.playTrack('1');

    expect(spotifyServiceMock.playTrackById).toHaveBeenCalledWith('1');
  });

  it('should set the username if provider is spotify', (done) => {
    // Arrange
    const mockResponse = {
      user: {
        user_metadata: {
          username: 'test_username'
        }
      }
    };

    jest.spyOn(providerServiceMock, 'getProviderName').mockReturnValue('spotify');
    jest.spyOn(authServiceMock, 'currentUser').mockReturnValue(of(mockResponse)); // Mock the Observable response

    // Act
    component.refresh();

    // Assert
    authServiceMock.currentUser().subscribe(() => {
      expect(component.username).toBe('test_username');
      done(); // Make sure the async test completes
    });
  });
/*
  it('should not set the username if provider is not spotify', () => {
    // Arrange
    providerServiceMock.getProviderName.mockImplementation(() => 'pootify');

    // Act
    component.refresh();

    // Assert
    //expect(authServiceMock.currentUser).not.toHaveBeenCalled(); // currentUser() shouldn't be called
    expect(component.username).toBeUndefined(); // Username shouldn't be set
  });*/
});
