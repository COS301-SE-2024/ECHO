import { TestBed } from '@angular/core/testing';
import { AuthCallbackComponent } from './authcallback.component';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from "../services/spotify.service";
import { Router } from '@angular/router';
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

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let mockAuthService: MockAuthService;
  let mockSpotifyService: MockSpotifyService;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockSpotifyService = new MockSpotifyService();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      // We provide our mocks
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SpotifyService, useValue: mockSpotifyService },
        { provide: Router, useValue: mockRouter },
        AuthCallbackComponent
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
    component.ngOnInit();
    await mockSpotifyService.initResponse;
    expect(mockRouter.lastNavigation).toEqual(['/home']);
  });

  it('should handle login error and navigate to login', async () => {
    mockAuthService.response = throwError(() => new Error('Error processing login'));
    component.ngOnInit();
    expect(mockRouter.lastNavigation).toEqual(['/login']);
  });
});
