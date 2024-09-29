import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongCardsComponent } from './song-cards.component';
import { ProviderService } from '../../../services/provider.service';
import { SpotifyService } from '../../../services/spotify.service';
import { YouTubeService } from '../../../services/youtube.service';
import { Router } from '@angular/router';
import { MoodService } from '../../../services/mood-service.service';
import { of } from 'rxjs';

describe('SongCardsComponent', () => {
  let component: SongCardsComponent;
  let fixture: ComponentFixture<SongCardsComponent>;
  let providerServiceMock: any;
  let spotifyServiceMock: any;
  let youtubeServiceMock: any;
  let routerMock: any;
  let moodServiceMock: any;

  beforeEach(async () => {
    providerServiceMock = { getProviderName: jest.fn() };
    spotifyServiceMock = { playTrackById: jest.fn() };
    youtubeServiceMock = { playTrackById: jest.fn() };
    routerMock = { navigate: jest.fn() };
    moodServiceMock = { 
      getComponentMoodClasses: jest.fn().mockReturnValue({ happy: 'happy-class' }),
      getMoodColors: jest.fn(),
      getCurrentMood: jest.fn(),

    };

    await TestBed.configureTestingModule({
      imports: [SongCardsComponent],
      providers: [
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: SpotifyService, useValue: spotifyServiceMock },
        { provide: YouTubeService, useValue: youtubeServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MoodService, useValue: moodServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SongCardsComponent);
    component = fixture.componentInstance;
    component.card = { text: 'Test Song', secondaryText: 'Test Artist' };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to echo song on Echo button click', () => {
    const event = new MouseEvent('click');
    jest.spyOn(event, 'stopPropagation'); // Spy on stopPropagation
    component.onEchoButtonClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/echo Song'], {
      queryParams: { trackName: 'Test Song', artistName: 'Test Artist' }
    });
  });

  it('should call SpotifyService to play a track when provider is Spotify', async () => {
    providerServiceMock.getProviderName.mockReturnValue('spotify');
    await component.playTrack('trackId123');
    expect(spotifyServiceMock.playTrackById).toHaveBeenCalledWith('trackId123');
  });

  it('should call YouTubeService to play a track when provider is YouTube', async () => {
    providerServiceMock.getProviderName.mockReturnValue('youtube');
    await component.playTrack('trackId123');
    expect(youtubeServiceMock.playTrackById).toHaveBeenCalledWith('trackId123');
  });

  it('should apply mood classes from MoodService', () => {
    expect(component.moodComponentClasses).toEqual({ happy: 'happy-class' });
  });

  // Additional tests can go here, such as checking for the output event, etc.
});
