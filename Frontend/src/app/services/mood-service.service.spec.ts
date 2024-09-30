import { TestBed } from '@angular/core/testing';
import { MoodService } from './mood-service.service';

describe('MoodService', () => {
  let service: MoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoodService],
    });
    service = TestBed.inject(MoodService);
    // Mock localStorage for testing
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize mood to "Neutral" if localStorage is empty', () => {
    jest.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
    service = new MoodService(); // Re-initialize to run the constructor
    expect(service.getCurrentMood()).toBe('Neutral');
  });

  it('should initialize mood from localStorage if available', () => {
    jest.spyOn(window.localStorage, 'getItem').mockReturnValue('Joy');
    service = new MoodService(); // Re-initialize to run the constructor
    expect(service.getCurrentMood()).toBe('Joy');
  });

  it('should set the current mood and update localStorage', () => {
    service.setCurrentMood('Anger');
    expect(service.getCurrentMood()).toBe('Anger');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('currentMood', 'Anger');
  });

  it('should return all available moods', () => {
    const moods = service.getAllMoods();
    expect(moods).toEqual(expect.arrayContaining(['Neutral', 'Joy', 'Surprise', 'Sadness', 'Anger', 'Disgust', 'Contempt', 'Shame', 'Fear', 'Guilt', 'Excitement', 'Love']));
  });

  it('should return mood colors', () => {
    const colors = service.getMoodColors();
    expect(colors).toHaveProperty('Joy', 'rgb(244, 189, 1)');
    expect(colors).toHaveProperty('Anger', 'rgb(164, 0, 20)');
  });

  it('should return the RGBA color for a given mood', () => {
    const color = service.getRBGAColor('Love');
    expect(color).toBe('rgb(238, 59, 133)');
  });
});
