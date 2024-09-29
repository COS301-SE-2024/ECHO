import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClient, provideHttpClient } from '@angular/common/http';

const mockRouter = (): jest.Mocked<Router> => ({
  navigate: jest.fn() // Mock the 'navigate' method
} as any); // Cast to `any` to avoid errors from optional methods in Router

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
}) as any;

const providerServiceMock = (): jest.Mocked<ProviderService> => ({
  getProviderName: jest.fn(),
}) as any;

describe('AuthService', () => {
  let service: AuthService;

  let tokenService: jest.Mocked<TokenService>;
  let providerService: jest.Mocked<ProviderService>;
  let router: jest.Mocked<Router>;
  let httpClientSpy: jest.SpyInstance<HttpClient>;
  let httpMock : HttpTestingController;
  beforeEach(() => {
    tokenService = tokenServiceMock();
    providerService = providerServiceMock();
    router = mockRouter();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
  });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenService },
        { provide: ProviderService, useValue: providerService },
        { provide: Router, useValue: router },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    //TestBed.inject(HttpTestingController).verify();
    localStorageMock.clear();
  });

  it('should call signIn with email and password', () => {
    const email = 'test@example.com';
    const password = 'password';
    
    service.signIn(email, password).subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/signin');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    req.flush({});
  });
  
  it('should call getTokens with accessToken and refreshToken', () => {
    const accessToken = 'accessToken';
    const refreshToken = 'refreshToken';
    tokenService.getAccessToken.mockReturnValue(accessToken);
    tokenService.getRefreshToken.mockReturnValue(refreshToken);
  
    service.getTokens().subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/providertokens');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ accessToken, refreshToken });
    req.flush({});
  });
  
  describe('signInWithOAuth', () => {
    it('should navigate to /home if already logged in', async () => {
      localStorage.setItem("loggedIn", "true");
      providerService.getProviderName.mockReturnValue('spotify');
  
      await service.signInWithOAuth();
  
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(localStorage.getItem('loggedIn')).toBe('true');
      
      // Since we are checking if no requests are made, we should not call httpMock.verify here.
      // Instead, we should call it only after making sure that http.post is not called.
    });
  
    it('should set loggedIn in localStorage and call http.post', async () => {
      localStorage.removeItem("loggedIn");
      providerService.getProviderName.mockReturnValue('spotify');
  
      const mockResponse = { url: 'http://localhost/' };
      const httpPostSpy = jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));
  
      await service.signInWithOAuth();
  
      expect(localStorage.getItem('loggedIn')).toBe('true');
      expect(httpPostSpy).toHaveBeenCalledWith(`${service['apiUrl']}/oauth-signin`, { provider: 'spotify' });
      expect(localStorage.getItem('spotifyReady')).toBe('true');
      expect(window.location.href).toBe(mockResponse.url);
      
    });
  
    it('should handle errors during signInWithOAuth', async () => {
      localStorage.removeItem("loggedIn");
      providerService.getProviderName.mockReturnValue('spotify');
  
      const errorResponse = { message: 'Error signing in' };
      jest.spyOn(service['http'], 'post').mockReturnValue(throwError(errorResponse));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  
      await service.signInWithOAuth();
  
      expect(consoleSpy).toHaveBeenCalledWith('OAuth signin error:', errorResponse);
    });
  
    it('should not set spotifyReady if provider is not spotify', async () => {
      localStorage.removeItem("loggedIn");
      providerService.getProviderName.mockReturnValue('other-provider');
  
      const mockResponse = { url: 'http://localhost/' };
      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));
  
      await service.signInWithOAuth();
  
      expect(localStorage.getItem('spotifyReady')).toBe(null); // Check that it was not set
      expect(window.location.href).toBe(mockResponse.url);
    });
  });
  
  
  it('should call signUp with email, password, and metadata', () => {
    const email = 'test@example.com';
    const password = 'password';
    const metadata = { key: 'value' };
  
    service.signUp(email, password, metadata).subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password, metadata });
    req.flush({});
  });
  
  it('should call signOut', () => {
    service.signOut().subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/signout');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
  
  it('should call currentUser with all tokens', () => {
    const tokens = { accessToken: 'accessToken', refreshToken: 'refreshToken' };
    tokenService.getAllTokens.mockReturnValue(tokens);
  
    service.currentUser().subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/current');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(tokens);
    req.flush({});
  });
  
  it('should call sendTokensToServer with tokens', () => {
    const tokens = { accessToken: 'accessToken', refreshToken: 'refreshToken', providerToken: 'providerToken', providerRefreshToken: 'providerRefreshToken' };
  
    service.sendTokensToServer(tokens).subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(tokens);
    req.flush({});
  });
  
  it('should call sendCodeToServer with code', () => {
    const code = 'code123';
  
    service.sendCodeToServer(code).subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/code');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ code });
    req.flush({});
  });
  
  it('should call getProvider', () => {
    service.getProvider().subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/provider');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  describe('spotifyReady', () => {
    it('should return true if localStorage has "spotifyReady" set to "true"', () => {
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => 'true'),
        },
        writable: true,
      });
  
      const result = service.spotifyReady();
      expect(localStorage.getItem).toHaveBeenCalledWith('spotifyReady');
      expect(result).toBe(true);
    });
  
    it('should return false if localStorage has "spotifyReady" set to "false"', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => 'false'),
        },
        writable: true,
      });
  
      const result = service.spotifyReady();
      expect(localStorage.getItem).toHaveBeenCalledWith('spotifyReady');
      expect(result).toBe(false);
    });
  
    it('should return false if localStorage is not available', () => {
      // Simulate localStorage being unavailable
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });
  
      const result = service.spotifyReady();
      expect(result).toBe(false);
    });
  
    it('should return false if localStorage has "spotifyReady" set to null', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => null),
        },
        writable: true,
      });
  
      const result = service.spotifyReady();
      expect(localStorage.getItem).toHaveBeenCalledWith('spotifyReady');
      expect(result).toBe(false);
    });
  });

  
  describe('isReady', () => {
    beforeEach(() => {
      // Reset the localStorage mock before each test
      localStorageMock.getItem.mockClear();
    });

    it('should return true when "ready" is set to "true" in localStorage', async () => {
      // Mock localStorage.getItem to return "true"
      localStorageMock.getItem.mockReturnValue('true');
  
      const result = await service.isReady();
  
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('ready');
    });
  
    it('should return false when "ready" is not set to "true" in localStorage', async () => {
      // Mock localStorage.getItem to return null or some other value
      localStorageMock.getItem.mockReturnValue(null);
  
      const result = await service.isReady();
  
      expect(result).toBe(false);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('ready');
    });
  });
  
  describe('setReady', () => {
    it('should set "ready" to "true" in localStorage', async () => {
      // Mock localStorage.setItem
      jest.spyOn(Storage.prototype, 'setItem');
  
      await service.setReady();
  
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ready', 'true');
    });
  });

  describe('verifyOfflineSession', () => {
    it('should return true if loggedIn is true', async () => {
      localStorageMock.getItem.mockReturnValue('true');
      console.log('loggedIn value before calling verifyOfflineSession:', localStorage.getItem("loggedIn"));
    
      const result = await service.verifyOfflineSession();
      
      expect(result).toBe(true);
    });
  
    it('should return false if loggedIn is false', async () => {
      localStorageMock.getItem.mockReturnValue('false');
  
      const result = await service.verifyOfflineSession();
  
      expect(result).toBe(false);
    });
  
    it('should return false if loggedIn is not set', async () => {
      const result = await service.verifyOfflineSession();
      
      expect(result).toBe(false);
    });
  });
});
