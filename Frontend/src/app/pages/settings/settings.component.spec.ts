import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { ThemeService } from '../../services/theme.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { SpotifyService } from '../../services/spotify.service';
import { of } from 'rxjs';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let themeServiceMock: any;
  let spotifyServiceMock: any;
  let screenSizeServiceMock: any;
  
  beforeEach(async () => {
    themeServiceMock = { switchTheme: jest.fn() };
    spotifyServiceMock = { init: jest.fn().mockResolvedValue(undefined) };
    screenSizeServiceMock = { screenSize$: of('large') };
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: SpotifyService, useValue: spotifyServiceMock },
        { provide: ScreenSizeService, useValue: screenSizeServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call switchTheme on themeService when switchTheme is called', () => {
    component.switchTheme();
    expect(themeServiceMock.switchTheme).toHaveBeenCalled();
  });

  it('should update activeSetting when showSettings is called', () => {
    const settingLabel = 'Audio';
    component.showSettings(settingLabel);
    expect(component.activeSetting).toBe(settingLabel);
  });

  it('should subscribe to screenSize$ on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.screenSize).toBe('large');
  });

  it('should call spotifyService init on ngOnInit if window is defined', async () => {
    await component.ngOnInit();
    expect(spotifyServiceMock.init).toHaveBeenCalled();
  });
});
