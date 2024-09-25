import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, ActivatedRoute, RouterEvent } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Observable, of, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { ScreenSizeService } from './services/screen-size-service.service';
import { ProviderService } from './services/provider.service';
import { MoodService } from './services/mood-service.service';
import { AuthService } from './services/auth.service';
import { PlayerStateService } from './services/player-state.service';
import { isPlatformBrowser } from '@angular/common';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // Mock services and router
  let routerMock: any;
  let screenSizeServiceMock: any;
  let providerServiceMock: any;
  let updatesMock: any;
  let moodServiceMock: any;
  let authServiceMock: any;
  let playerStateServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Define mocks for dependencies
    routerMock = {
      events: new Subject<RouterEvent>(),
      url: '/login'
    };
    screenSizeServiceMock = {
      screenSize$: of('desktop')
    };
    providerServiceMock = {};
    updatesMock = {
      versionUpdates: new Subject(),
      activateUpdate: jest.fn().mockResolvedValue(true)
    };
    moodServiceMock = {
      getBackgroundMoodClasses: jest.fn().mockReturnValue({}),
      getMoodColors: jest.fn().mockReturnValue({}),
      getCurrentMood: jest.fn()
    };
    authServiceMock = {
      isLoggedIn$: of(true),
      signOut: jest.fn()
    };
    playerStateServiceMock = {
      setReady: jest.fn(),
      isReady: jest.fn().mockReturnValue(true)
    };
    activatedRouteMock = {};

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ScreenSizeService, useValue: screenSizeServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: SwUpdate, useValue: updatesMock },
        { provide: MoodService, useValue: moodServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: PlayerStateService, useValue: playerStateServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: 'PLATFORM_ID', useValue: 'browser' } // Simulate browser platform
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to screen size changes on init', () => {
    component.ngOnInit();
    expect(screenSizeServiceMock.screenSize$).toBeDefined();
    expect(component.screenSize).toBe('desktop');
  });

  it('should set player ready after view init', () => {
    component.ngAfterViewInit();
    expect(playerStateServiceMock.setReady).toHaveBeenCalled();
  });

  it('should detect auth and callback routes correctly', () => {
    routerMock.events.next(new NavigationEnd(0, '/login', '/login'));
    expect((component as any).isAuthRoute).toBe(true);

    routerMock.events.next(new NavigationEnd(0, '/auth/callback', '/auth/callback'));
    expect((component as any).isCallbackRoute).toBe(true);
  });

  it('should check if the current route is auth route', () => {
    routerMock.url = '/login';
    expect(component.isCurrentRouteAuth()).toBe(true);

    routerMock.url = '/some-other-route';
    expect(component.isCurrentRouteAuth()).toBe(false);
  });

  it('should return player state readiness correctly', () => {
    expect(component.isReady()).toBe(true);
  });

  it('should handle sw update events and reload page on version ready', async () => {
    updatesMock.versionUpdates.next({ type: 'VERSION_READY' });
    expect(updatesMock.activateUpdate).toHaveBeenCalled();
  });

  it('should call signOut on destroy', () => {
    component.ngOnDestroy();
    expect(authServiceMock.signOut).toHaveBeenCalled();
  });
});
