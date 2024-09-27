import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { SideBarComponent } from './side-bar.component';
import { SpotifyService } from '../../../services/spotify.service';
import { JsonpClientBackend, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ScreenSizeService } from '../../../services/screen-size-service.service';
import { AuthService } from '../../../services/auth.service';
import { ProviderService } from '../../../services/provider.service';
import { of } from 'rxjs';
import { IterableDiffers, provideExperimentalCheckNoChangesForDebug } from '@angular/core';


describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let themeServiceMock: any;
  let spotifyServiceMock: any;
  let screenSizeServiceMock: any;
  let authServiceMock: any;
  let providerServiceMock: any;

  beforeEach(async () => {

    //Mocks for dependencies

    themeServiceMock = { /* Mock goes here when I figure out how to do it */ }
    spotifyServiceMock = {
      getQueue: jest.fn().mockResolvedValue([]),
      getRecentlyPlayedTracks: jest.fn().mockResolvedValue({ items: [] }),
      playTrackById: jest.fn().mockResolvedValue(null)
    };
    screenSizeServiceMock = {
      screenSize$: of('large')
    };
    authServiceMock = {
      getProvider: jest.fn().mockReturnValue(of('spotify'))
    };
    providerServiceMock = {
      getProviderName: jest.fn().mockReturnValue('spotify')
    };
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule, // Assuming you're using Angular Material cards
        NgForOf,
        NgIf,
        NgClass,
        SideBarComponent  // Since it's a standalone component
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: SpotifyService, useValue: spotifyServiceMock },
        { provide: ScreenSizeService, useValue: screenSizeServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ProviderService, useValue: providerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
/*
  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
*/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add tests for async methods if needed
  it('should load queue data on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.upNextCardData.length).toBe(1);
    flush();
  }));
/*
  afterEach(() => {
    fixture.destroy();
  });
*/
  it('should toggle dropdown visibility', () => {
    component.isDropdownVisible = false;
    component.toggleDropdown();
    expect(component.isDropdownVisible).toBe(true);
    component.toggleDropdown();
    expect(component.isDropdownVisible).toBe(false);
  });

  it('should change selected option', () => {
    component.selectedOptionChange('Recent Listening...');
    expect(component.selected).toBe('Recent Listening...');
    expect(component.selectedOption).toBe('recentListening');
    expect(component.isDropdownVisible).toBe(true);
  });
  

  
  describe('loadUpNextData', () => {
    it('should load up next data', async () => {
      await component.loadUpNextData();
      expect(spotifyServiceMock.getQueue).toHaveBeenCalledWith(component.provider);
      expect(component.upNextCardData.length).toBe(2);  // Adjust based on mock data
    });
  });

  
  describe('getRecentListeningCardData', () => {
    it('should return up to 10 recent listening card data', () => {
    // Arrange
    component.recentListeningCardData = Array.from({ length: 15 }, (_, i) => ({ id: i }));

    // Act
    const result = component.getRecentListeningCardData();

    // Assert
    expect(result.length).toBe(10);
    expect(result).toEqual(component.recentListeningCardData.slice(0, 10));
  });
  });

  /*
  describe('getEchoedCardData', () => {

  });

  */
  describe('selectOption', () => {
    it('should contain a selected option', () => {
      component.selectedOption = "old option";

      component.selectOption("new option");
      expect(component.selectedOption).toEqual("new option");
    });
  });


  describe('playTrack', () => {
    it('should play track by id', async () => {
      await component.playTrack('trackId');
      expect(spotifyServiceMock.playTrackById).toHaveBeenCalledWith('trackId');
    });
  });
  
});
