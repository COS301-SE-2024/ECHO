import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { ReplaySubject, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { SpotifyService } from './services/spotify.service';

// Mock classes
class MockRouter {
  private eventSubject = new ReplaySubject<RouterEvent>(1);
  events = this.eventSubject.asObservable();

  // Simulate navigation events
  simulateNavigation(url: string) {
    this.eventSubject.next(new NavigationEnd(1, url, url));
  }
}

class MockAuthService {
  sendTokensToServer() {
    return of({});
  }
}

class MockSpotifyService {
  init() {
    return Promise.resolve();
  }

  disconnectPlayer() {
    // Mock implementation for disconnectPlayer
  }

  currentlyPlayingTrack$ = new ReplaySubject<any>(1); // Observable for currently playing track
  playingState$ = new ReplaySubject<boolean>(1); // Observable for playing state
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: MockRouter;
  let mockAuthService: MockAuthService;
  let mockSpotifyService: MockSpotifyService;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockAuthService = new MockAuthService();
    mockSpotifyService = new MockSpotifyService();

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SpotifyService, useValue: mockSpotifyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show player on specific routes', () => {
    mockRouter.simulateNavigation('/home');
    fixture.detectChanges();
    expect(component.showPlayer).toBe(true);

    mockRouter.simulateNavigation('/profile');
    fixture.detectChanges();
    expect(component.showPlayer).toBe(true);
  });

  it('should not show player on other routes', () => {
    mockRouter.simulateNavigation('/other');
    fixture.detectChanges();
    expect(component.showPlayer).toBe(false);
  });
});
