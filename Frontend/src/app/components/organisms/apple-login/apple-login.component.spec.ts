import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppleLoginComponent } from './apple-login.component';
import { ProviderService } from '../../services/provider.service';
import { AuthService } from '../../services/auth.service';

describe('AppleLoginComponent', () => {
  let component: AppleLoginComponent;
  let fixture: ComponentFixture<AppleLoginComponent>;
  let authServiceMock: any;
  let providerServiceMock: any

  beforeEach(async () => {
    authServiceMock = {
      signInWithOAuth: jest.fn().mockReturnValue(Promise.resolve())
    };

    providerServiceMock = {
      setProviderName: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AppleLoginComponent],
      providers: [
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set provider name to google on loginWithGoogle', async () => {
    await component.loginWithApple();
    expect(providerServiceMock.setProviderName).toHaveBeenCalledWith('apple');
  });
/*
  it('should call signInWithOAuth on loginWithGoogle', async () => {
    await component.loginWithApple();
    expect(authServiceMock.signInWithOAuth).toHaveBeenCalled();
  });

  it('should handle error during signInWithOAuth', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    authServiceMock.signInWithOAuth.mockReturnValue(Promise.reject('OAuth Error'));

    await component.loginWithApple();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing in with OAuth:', 'OAuth Error');

    consoleErrorSpy.mockRestore();
  });
  */
});
