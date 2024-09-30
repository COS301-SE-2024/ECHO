import { TestBed } from '@angular/core/testing';
import { AuthCallbackComponent } from './authcallback.component';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from "../services/spotify.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

// Mock classes
class MockAuthService {
  response = of({});
  sendTokensToServer(tokens: any): Observable<any> {
    return this.response;
  }
}

class MockSpotifyService {
  initResponse = Promise.resolve();
  init(): Promise<void> {
    return this.initResponse;
  }
}

class MockRouter {
  lastNavigation: any[] = [];
  navigate(commands: any[]): Promise<boolean> {
    this.lastNavigation = commands;
    return Promise.resolve(true);
  }
}

// Mock ActivatedRoute
class MockActivatedRoute {
  fragment = of('access_token=mock_access_token&refresh_token=mock_refresh_token');
}

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let mockAuthService: MockAuthService;
  let mockSpotifyService: MockSpotifyService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockSpotifyService = new MockSpotifyService();
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      // We provide our mocks
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SpotifyService, useValue: mockSpotifyService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Mock ActivatedRoute
        AuthCallbackComponent,
      ]
    });

    component = TestBed.inject(AuthCallbackComponent);
    // Mock alert
    window.alert = jest.fn();
    // Set hash for testing
    Object.defineProperty(window, 'location', {
      value: {
        hash: '#access_token=mock_access_token&refresh_token=mock_refresh_token'
      }
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process login successfully and navigate to home', async () => {
    await component.ngOnInit();  // Wait for ngOnInit to complete
    await mockSpotifyService.initResponse;  // Wait for Spotify service init to complete
    expect(mockRouter.lastNavigation).toEqual(['/home']);  // Check if navigation happened
  });

  it('should handle login error and navigate to login', async () => {
    mockAuthService.response = throwError(() => new Error('Error processing login'));
    await component.ngOnInit();  // Wait for ngOnInit to complete
    expect(mockRouter.lastNavigation).toEqual(['/login']);  // Check if navigation to login happened
  });
});
