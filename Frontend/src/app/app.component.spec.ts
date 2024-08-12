import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd } from '@angular/router';
import { ScreenSizeService } from './services/screen-size-service.service';
import { ProviderService } from './services/provider.service';
import { SwUpdate } from '@angular/service-worker';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let screenSizeService: ScreenSizeService;
  let providerService: ProviderService;
  let swUpdate: SwUpdate;
  let routerEventsSubject: Subject<any>;
  let screenSizeSubject: Subject<string>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();
    screenSizeSubject = new Subject<string>();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: Router, useValue: { events: routerEventsSubject.asObservable() } },
        { provide: ScreenSizeService, useValue: { screenSize$: screenSizeSubject.asObservable() } },
        { provide: ProviderService, useValue: {} },
        { provide: SwUpdate, useValue: { versionUpdates: of({ type: 'VERSION_READY' }), activateUpdate: jest.fn().mockResolvedValue({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    screenSizeService = TestBed.inject(ScreenSizeService);
    providerService = TestBed.inject(ProviderService);
    swUpdate = TestBed.inject(SwUpdate);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize title to Echo', () => {
    expect(component.title).toBe('Echo');
  });

  it('should update showPlayer based on navigation end events', () => {
    routerEventsSubject.next(new NavigationEnd(0, '/home', '/home'));
    expect(component.showPlayer).toBe(true);

    routerEventsSubject.next(new NavigationEnd(0, '/profile', '/profile'));
    expect(component.showPlayer).toBe(true);

    routerEventsSubject.next(new NavigationEnd(0, '/other', '/other'));
    expect(component.showPlayer).toBe(false);
  });

  it('should update displayPlayer based on navigation end events', () => {
    routerEventsSubject.next(new NavigationEnd(0, '/settings', '/settings'));
    expect(component.displayPlayer).toBe(true);

    routerEventsSubject.next(new NavigationEnd(0, '/home', '/home'));
    expect(component.displayPlayer).toBe(false);
  });

  it('should handle version updates', async () => {
    const activateUpdateSpy = jest.spyOn(swUpdate, 'activateUpdate').mockResolvedValue(true);
    //const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

    swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        expect(activateUpdateSpy).toHaveBeenCalled();
        expect(component.update).toBe(true);
        //expect(reloadSpy).toHaveBeenCalled();
      }
    });
  });

  it('should subscribe to screen size changes on init', () => {
    component.ngOnInit();
    screenSizeSubject.next('large');
    expect(component.screenSize).toBe('large');

    screenSizeSubject.next('small');
    expect(component.screenSize).toBe('small');
  });
});
