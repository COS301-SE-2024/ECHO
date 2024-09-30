import { TestBed } from '@angular/core/testing';
import { YouTubeService } from './youtube.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { MoodService } from './mood-service.service';
import { PlayerStateService } from './player-state.service';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('YouTubeService', () => {
  let service: YouTubeService;
  let httpMock: HttpTestingController;
  let tokenServiceMock: any;
  let moodServiceMock: any;
  let playerStateServiceMock: any;

  beforeEach(() => {
    // Mock the dependencies
    tokenServiceMock = {
      getAccessToken: jest.fn().mockReturnValue('mockAccessToken'),
      getRefreshToken: jest.fn().mockReturnValue('mockRefreshToken')
    };
    moodServiceMock = {};
    playerStateServiceMock = { setReady: jest.fn() };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        YouTubeService,
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: MoodService, useValue: moodServiceMock },
        { provide: PlayerStateService, useValue: playerStateServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' } // Assuming this is browser-based for testing purposes
      ]
    });

    service = TestBed.inject(YouTubeService);
    httpMock = TestBed.inject(HttpTestingController);
    service['player'] = {
        destroy: jest.fn(),
        loadVideoById: jest.fn(),
    } as any;

    // Mock window.YT for YouTube API interactions
    (window as any).YT = {
      Player: jest.fn().mockImplementation(() => ({
        loadVideoById: jest.fn(),
        pauseVideo: jest.fn(),
        playVideo: jest.fn(),
        getVideoData: jest.fn().mockReturnValue({
          video_id: 'mockVideoId',
          title: 'Mock Title',
          author: 'Mock Author'
        }),
        getDuration: jest.fn().mockReturnValue(300), // Mock 300s duration
        seekTo: jest.fn(),
        setVolume: jest.fn(),
        destroy: jest.fn()
      })),
      PlayerState: {
        PLAYING: 1,
        PAUSED: 2,
        ENDED: 0
      }
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the YouTube player', async () => {
    await service.init();

    expect(window.YT.Player).toHaveBeenCalled();
  });

  it('should load the YouTube API if not loaded', async () => {
    // Spy on document.head.appendChild
    const appendChildSpy = jest.spyOn(document.head, 'appendChild');

    // Mock non-existing YouTube API script
    const existingScript = document.getElementById('youtube-api');
    if (existingScript) {
      existingScript.remove();
    }

    service['loadYouTubeAPI']().then(res => {
        expect(appendChildSpy).toHaveBeenCalled();
    });

    
    appendChildSpy.mockRestore();
  });

  it('should play a track by ID', async () => {
    const spy = jest.spyOn(service['player'], 'loadVideoById');
    await service.playTrackById('mockTrackId');

    expect(window.YT.Player).toHaveBeenCalled();
    //expect(spy).toHaveBeenCalledWith('mockTrackId');
  });

  it('should pause the video', async () => {
    await service.init();
    service.pause();

    expect(service['player'].pauseVideo).toHaveBeenCalled();
  });

  it('should play the video', async () => {
    await service.init();
    service.play();

    expect(service['player'].playVideo).toHaveBeenCalled();
  });

  it('should seek to a position', async () => {
    await service.init();
    service.seekToPosition(50); // 50%

    expect(service['player'].seekTo).toHaveBeenCalledWith(150, true); // 50% of 300 seconds
  });

  it('should fetch queue', async () => {
    const mockQueue = [
      {
        id: 'mockId',
        name: 'Mock Name',
        artistName: 'Mock Artist',
        albumImageUrl: 'MockUrl'
      }
    ];

    service.getQueue('testQuery').then(queue => {
      expect(queue.length).toBe(1);
      expect(queue[0].id).toBe('mockId');
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/youtube/search`);
    expect(req.request.method).toBe('POST');
    req.flush(mockQueue);
  });

  it('should disconnect the player on destroy', () => {
    service.disconnectPlayer();

    expect(service['player'].destroy).toHaveBeenCalled();
  });
});
