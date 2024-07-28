import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProviderService } from './provider.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceMock: any;
  let providerServiceMock: any;

  beforeEach(() => {
    tokenServiceMock = {
      getAccessToken: jest.fn(),
      getRefreshToken: jest.fn(),
      getAllTokens: jest.fn(),
    };

    providerServiceMock = {
      getProviderName: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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
    tokenServiceMock.getAccessToken.mockReturnValue(accessToken);
    tokenServiceMock.getRefreshToken.mockReturnValue(refreshToken);
  
    service.getTokens().subscribe();
  
    const req = httpMock.expectOne('http://localhost:3000/api/auth/providertokens');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ accessToken, refreshToken });
    req.flush({});
  });
  
  it('should redirect to OAuth URL on signInWithOAuth', async () => {
    const providerName = 'spotify';
    const oAuthUrl = 'http://localhost:3000/oauth';
  
    providerServiceMock.getProviderName.mockReturnValue(providerName);
  
    service.signInWithOAuth();
    
    const req = httpMock.expectOne('http://localhost:3000/api/auth/oauth-signin');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ provider: providerName });
    req.flush({ url: oAuthUrl });
  
    expect(window.location.href).toBe(oAuthUrl);
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
    tokenServiceMock.getAllTokens.mockReturnValue(tokens);
  
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
  
});
