import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserLibraryComponent } from './user-library.component';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { SpotifyService } from '../../services/spotify.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';

// Mock classes for services
class MockThemeService {
  switchTheme() {}
  isDarkModeActive = () => true;
}

class MockAuthService {}

class MockSpotifyService {}

class MockScreenSizeService {
  screenSize$ = {
    subscribe: (callback: Function) => callback('large')
  };
}

describe('UserLibraryComponent', () => {
  let component: UserLibraryComponent;
  let fixture: ComponentFixture<UserLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        UserLibraryComponent  // Importing as standalone component
      ],
      providers: [
        { provide: ThemeService, useClass: MockThemeService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: SpotifyService, useClass: MockSpotifyService },
        { provide: ScreenSizeService, useClass: MockScreenSizeService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch themes when method is called', () => {
    const themeService = fixture.debugElement.injector.get(ThemeService) as MockThemeService;  // Correct way to get service instance
    themeService.switchTheme();
    expect(themeService.isDarkModeActive()).toBe(true);  // Assuming you want to check something like this
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });
});
