import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

const mockRouter = (): jest.Mocked<Router> => ({
  navigate: jest.fn().mockResolvedValue(true), // Properly mock the navigation to resolve successfully
}) as any;

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

const tokenServiceMock = (): jest.Mocked<TokenService> => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  getAllTokens: jest.fn(),
  clearTokens: jest.fn(),
}) as any;

const providerServiceMock = (): jest.Mocked<ProviderService> => ({
  getProviderName: jest.fn(),
}) as any;

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: jest.Mocked<TokenService>;
  let providerService: jest.Mocked<ProviderService>;
  let router: jest.Mocked<Router>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    tokenService = tokenServiceMock();
    providerService = providerServiceMock();
    router = mockRouter();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenService },
        { provide: ProviderService, useValue: providerService },
        { provide: Router, useValue: router },
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('signInWithOAuth', () => {
    it('should navigate to /home if already logged in', async () => {
      // Simulate the user being logged in
      localStorage.setItem('loggedIn', 'true');
      providerService.getProviderName.mockReturnValue('spotify');

      // Call the OAuth login
      await service.signInWithOAuth();

      // Ensure that navigation to /home happens
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(localStorage.getItem('loggedIn')).toBe('true');
    });

    it('should not set spotifyReady if provider is not spotify', async () => {
      // Ensure clean state for the test
      localStorage.removeItem('spotifyReady');

      // Mock non-Spotify provider
      providerService.getProviderName.mockReturnValue('other-provider');

      // Mock HTTP response for OAuth login
      const mockResponse = { url: 'http://localhost/' };
      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));

      // Call the OAuth login
      await service.signInWithOAuth();

      // Ensure spotifyReady is not set for non-Spotify providers
      expect(localStorage.getItem('spotifyReady')).toBe(null);
      // Ensure the correct redirection
      expect(window.location.href).toBe(mockResponse.url);
    });
  });
});
