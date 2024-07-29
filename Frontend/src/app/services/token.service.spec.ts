import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';

describe('TokenService', () => {
  let service: TokenService;
  const mockSessionStorage = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
    mockSessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize tokens from sessionStorage', () => {
    mockSessionStorage.setItem('accessToken', 'testAccessToken');
    mockSessionStorage.setItem('refreshToken', 'testRefreshToken');
    service = new TokenService();
    expect(service.getAccessToken()).toBe('testAccessToken');
    expect(service.getRefreshToken()).toBe('testRefreshToken');
  });

  it('should set tokens in BehaviorSubjects and sessionStorage', () => {
    service.setTokens('newAccessToken', 'newRefreshToken');
    expect(service.getAccessToken()).toBe('newAccessToken');
    expect(service.getRefreshToken()).toBe('newRefreshToken');
    expect(mockSessionStorage.getItem('accessToken')).toBe('newAccessToken');
    expect(mockSessionStorage.getItem('refreshToken')).toBe('newRefreshToken');
  });

  it('should clear tokens from BehaviorSubjects and sessionStorage', () => {
    service.setTokens('newAccessToken', 'newRefreshToken');
    service.clearTokens();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(mockSessionStorage.getItem('accessToken')).toBeNull();
    expect(mockSessionStorage.getItem('refreshToken')).toBeNull();
  });

  it('should return access token as observable', (done) => {
    service.setTokens('observableAccessToken', 'observableRefreshToken');
    service.getAccessToken$().subscribe((token) => {
      expect(token).toBe('observableAccessToken');
      done();
    });
  });

  it('should return all tokens', () => {
    service.setTokens('accessToken', 'refreshToken');
    const tokens = service.getAllTokens();
    expect(tokens.accessToken).toBe('accessToken');
    expect(tokens.refreshToken).toBe('refreshToken');
  });
});
