import { TestBed } from '@angular/core/testing';
import { PlayerStateService } from './player-state.service'; // Adjust the import based on your file structure

describe('PlayerStateService', () => {
  let service: PlayerStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [PlayerStateService]
    });
    service = TestBed.inject(PlayerStateService);
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(),
          setItem: jest.fn(),
        },
        writable: true,
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the current track', () => {
    const track = { title: 'Test Track' };
    service.setCurrentTrack(track);

    service.currentTrack$.subscribe((currentTrack) => {
      expect(currentTrack).toEqual(track);
    });
  });

  it('should set local storage item for spotifyReady', async () => {
    await service.setSpotifyReady();
    expect(localStorage.setItem).toHaveBeenCalledWith('spotifyReady', 'true');
  });

  it('should return true when spotify is ready', async () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('true');
    const ready = await service.spotifyReady();
    expect(ready).toBe(true);
  });

  it('should return false when spotify is not ready', async () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('false');
    const ready = await service.spotifyReady();
    expect(ready).toBe(false);
  });

  it('should return false if localStorage is not available in isReady', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is not available');
    });

    const isReady = service.isReady();
    expect(isReady).toBe(false);
  });

  it('should return true if readyToPlay is true', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('true');
    const isReady = service.isReady();
    expect(isReady).toBe(true);
  });

  it('should set local storage item for readyToPlay', () => {
    service.setReady();
    expect(localStorage.setItem).toHaveBeenCalledWith('readyToPlay', 'true');
  });
});
