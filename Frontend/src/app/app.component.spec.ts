import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ScreenSizeService } from './services/screen-size-service.service';
import { SwUpdate } from '@angular/service-worker';
import { ProviderService } from './services/provider.service';
import { MoodService } from './services/mood-service.service';
import { AuthService } from './services/auth.service';
import { PlayerStateService } from './services/player-state.service';
import { of, Observable } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: any;
  let mockScreenSizeService: any;
  let mockProviderService: any;
  let mockUpdates: any;
  let mockMoodService: any;
  let mockAuthService: any;
  let mockPlayerStateService: any;

  beforeEach(async () => {
    mockRouter = {
      events: of(new NavigationEnd(0, '/test', '/test')),
      url: '/test',
    };
    mockScreenSizeService = { screenSize$: of('large') };
    mockProviderService = {};
    mockUpdates = { versionUpdates: of({ type: 'VERSION_READY' }) };
    mockMoodService = {
      getMoodColors: jest.fn()
    };
    mockAuthService = { isLoggedIn$: of(true), signOut: jest.fn() };
    mockPlayerStateService = { setReady: jest.fn(), isReady: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
        { provide: ScreenSizeService, useValue: mockScreenSizeService },
        { provide: ProviderService, useValue: mockProviderService },
        { provide: SwUpdate, useValue: mockUpdates },
        { provide: MoodService, useValue: mockMoodService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PlayerStateService, useValue: mockPlayerStateService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should subscribe to screenSizeService and set screenSize', () => {
      component.ngOnInit();
      expect(component.screenSize).toBe('large');
    });
  });

  describe('ngAfterViewInit', () => {
    it('should call playerStateService.setReady', () => {
      component.ngAfterViewInit();
      expect(mockPlayerStateService.setReady).toHaveBeenCalled();
    });
  });

  describe('isCurrentRouteAuth', () => {
    it('should return true for auth routes', () => {
      mockRouter.url = '/login';
      expect(component.isCurrentRouteAuth()).toBe(true);
    });

    it('should return false for non-auth routes', () => {
      mockRouter.url = '/home';
      expect(component.isCurrentRouteAuth()).toBe(false);
    });
  });

  describe('layout', () => {
    it('should set columnStart and colSpan based on sidebar state', () => {
      component.layout(true);
      expect(component.columnStart).toBe(1);
      expect(component.colSpan).toBe(5);

      component.layout(false);
      expect(component.columnStart).toBe(3);
      expect(component.colSpan).toBe(4);
    });
  });

  describe('isReady', () => {
    it('should return playerStateService.isReady if platform is browser', () => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(true);
      mockPlayerStateService.isReady.mockReturnValue(true);
      expect(component.isReady()).toBe(true);
    });

    it('should return false if platform is not browser', () => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(false);
      expect(component.isReady()).toBe(false);
    });
  });

  describe('toggleSideBar', () => {
    it('should toggle isSideBarHidden and call layout with the new state', () => {
      jest.spyOn(component, 'layout');
      component.isSideBarHidden = false;
      component.toggleSideBar();
      expect(component.isSideBarHidden).toBe(true);
      expect(component.layout).toHaveBeenCalledWith(true);
    });
  });

});
