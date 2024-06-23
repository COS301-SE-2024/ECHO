import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { SideBarComponent } from './side-bar.component';
import { SpotifyService } from '../../services/spotify.service';
import { ThemeService } from '../../services/theme.service';

// Simple TypeScript class mocks
class MockSpotifyService {
  getQueue() {
    return Promise.resolve([
      { id: '1', name: 'Queue Track 1', album: { images: [{ url: 'url1' }] } },
      { id: '2', name: 'Queue Track 2', album: { images: [{ url: 'url2' }] } },
    ]);
  }

  getRecentlyPlayedTracks() {
    return Promise.resolve({
      items: [
        { track: { id: '1', name: 'Track 1', album: { images: [{ url: 'url1' }] }, artists: [{ name: 'Artist 1' }], explicit: false } },
        { track: { id: '2', name: 'Track 2', album: { images: [{ url: 'url2' }] }, artists: [{ name: 'Artist 2' }], explicit: true } },
      ],
    });
  }

  playTrackById(trackId: string) {
    return Promise.resolve();
  }
}

class MockThemeService {
  switchTheme() { }
}

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule, // Assuming you're using Angular Material cards
        NgForOf,
        NgIf,
        NgClass,
        SideBarComponent  // Since it's a standalone component
      ],
      providers: [
        { provide: SpotifyService, useClass: MockSpotifyService },
        { provide: ThemeService, useClass: MockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add tests for async methods if needed
  it('should load queue data on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.upNextCardData.length).toBe(2);
    flush();
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
