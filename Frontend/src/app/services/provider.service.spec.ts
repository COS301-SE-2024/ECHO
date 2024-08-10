import { TestBed } from '@angular/core/testing';
import { ProviderService } from './provider.service';

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderService);
    // Mock localStorage
    let store: { [key: string]: string } = {};

    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return store[key] || null;
      },
      setItem: (key: string, value: string): void => {
        store[key] = value;
      },
      clear: (): void => {
        store = {};
      },
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set provider name in localStorage', () => {
    const providerName = 'spotify';
    service.setProviderName(providerName);
    expect(localStorage.getItem('provider')).toBe(providerName);
  });

  it('should get provider name from localStorage', () => {
    const providerName = 'spotify';
    localStorage.setItem('provider', providerName);
    expect(service.getProviderName()).toBe(providerName);
  });

  it('should return default provider name if localStorage is empty', () => {
    localStorage.clear();
    expect(service.getProviderName()).toBe('default');
  });

/*
  it('should return "email" if localStorage is undefined', () => {
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
    });
    expect(service.getProviderName()).toBe('default');
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
  });
*/
  it('should clear localStorage', () => {
    localStorage.setItem('provider', 'spotify');
    service.clear();
    expect(localStorage.getItem('provider')).toBeNull();
  });
});
