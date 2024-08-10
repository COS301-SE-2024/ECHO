import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';
import { isPlatformBrowser } from '@angular/common';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' }, // Mock PLATFORM_ID for browser
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when running in browser', () => {
    beforeEach(() => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(true);
    });

/*
    it('should initialize with dark mode active and apply dark class to body', () => {
      document.body.classList.remove('dark'); // Ensure initial state
      service = TestBed.inject(ThemeService);
      expect(isPlatformBrowser).toHaveBeenCalledWith('browser');
      expect(document.body.classList.contains('dark')).toBe(true);
      expect(service.isDarkModeActive()).toBe(true);
    });

    */
    it('should toggle dark mode and update body class on switchTheme call', () => {
      service.switchTheme();
      expect(document.body.classList.contains('dark')).toBe(false);
      expect(service.isDarkModeActive()).toBe(false);

      service.switchTheme();
      expect(document.body.classList.contains('dark')).toBe(true);
      expect(service.isDarkModeActive()).toBe(true);
    });
  });

  describe('when not running in browser', () => {
    beforeEach(() => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(false);
    });

    it('should initialize without modifying the body class', () => {
      document.body.classList.remove('dark'); // Ensure initial state
      service = TestBed.inject(ThemeService);
      expect(isPlatformBrowser).toHaveBeenCalledWith('browser');
      expect(document.body.classList.contains('dark')).toBe(false);
      expect(service.isDarkModeActive()).toBe(true);
    });

    it('should not toggle the body class on switchTheme call', () => {
      service.switchTheme();
      expect(document.body.classList.contains('dark')).toBe(false);
      expect(service.isDarkModeActive()).toBe(false);

      service.switchTheme();
      expect(document.body.classList.contains('dark')).toBe(false);
      expect(service.isDarkModeActive()).toBe(true);
    });
  });
});
