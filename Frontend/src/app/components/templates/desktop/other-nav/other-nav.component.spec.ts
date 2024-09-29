import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtherNavComponent } from './other-nav.component';
import { AuthService } from '../../../../services/auth.service';
import { SpotifyService } from '../../../../services/spotify.service';
import { ProviderService } from '../../../../services/provider.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('OtherNavComponent', () => {
  let component: OtherNavComponent;
  let fixture: ComponentFixture<OtherNavComponent>;
  let authService: AuthService;
  let spotifyService: SpotifyService;
  let providerService: ProviderService;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      currentUser: jest.fn().mockReturnValue(of({ user: { user_metadata: { name: 'Test User' } } })),
      signOut: jest.fn().mockReturnValue(of(null))
    };

    const providerServiceMock = {
      getProviderName: jest.fn().mockReturnValue('spotify')
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [OtherNavComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SpotifyService, useValue: {} },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherNavComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    spotifyService = TestBed.inject(SpotifyService);
    providerService = TestBed.inject(ProviderService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set username after ngAfterViewInit if provider is spotify', () => {
    component.ngAfterViewInit();
    expect(component.username).toBe('Test User');
  });

  it('should toggle dropdown state', () => {
    expect(component.isDropdownOpen).toBe(false);
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(true);
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(false);
  });

  it('should close dropdown on document click', () => {
    component.isDropdownOpen = true;
    const mockEvent = new MouseEvent('click');
    Object.defineProperty(mockEvent, 'target', { value: document.createElement('div') });

    const dropdownButton = document.createElement('div');
    dropdownButton.id = 'dropdownInformationButton';
    document.body.appendChild(dropdownButton);

    component.onDocumentClick(mockEvent);
    expect(component.isDropdownOpen).toBe(false);

    // Clean up
    document.body.removeChild(dropdownButton);
  });

  it('should sign out and navigate to login', () => {
    component.signOut();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle sign out error', () => {
    jest.spyOn(authService, 'signOut').mockReturnValue(throwError(() => new Error('Sign out error')));
    console.error = jest.fn(); // Mock console.error
    component.signOut();
    expect(console.error).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
  });
});
