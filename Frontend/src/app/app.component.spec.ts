import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScreenSizeService } from './services/screen-size-service.service';
import { ProviderService } from './services/provider.service';
import { SwUpdate } from '@angular/service-worker';
import { of, Subject } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
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
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
            navigate: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('mockValue')
              },
              queryParamMap: {
                get: jest.fn().mockReturnValue('mockValue')
              }
            }
          }
        },
        {
          provide: ScreenSizeService,
          useValue: { screenSize$: screenSizeSubject.asObservable() }
        },
        {
          provide: ProviderService,
          useValue: {}
        },
        {
          provide: SwUpdate,
          useValue: {
            versionUpdates: of({
              type: 'VERSION_READY'
            }),
            activateUpdate: jest.fn().mockReturnValue(Promise.resolve())
          }
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    screenSizeService = TestBed.inject(ScreenSizeService);
    providerService = TestBed.inject(ProviderService);
    swUpdate = TestBed.inject(SwUpdate);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize title to Echo', () => {
    expect(component.title).toBe('Echo');
  });

  it('should update showPlayer based on navigation end events', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/home#search', '/home#search'));
    //fixture.detectChanges();
    expect(component.showPlayer).toBe(true);
  });

  it('should update displayPlayer based on navigation end events', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/settings', '/settings'));
    //fixture.detectChanges();
    expect(component.displayPlayer).toBe(true);
  });

  it('should handle version updates', async () => {
    await fixture.whenStable();
    expect(swUpdate.activateUpdate).toHaveBeenCalled();
  });

  it('should subscribe to screen size changes on init', () => {
    screenSizeSubject.next('large');
    fixture.detectChanges();
    expect(component.screenSize).toBe('large');
  });
});
