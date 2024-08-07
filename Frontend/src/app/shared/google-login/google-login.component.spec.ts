/// reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleLoginComponent } from './google-login.component';
import { IterableDiffers } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProviderService } from '../../services/provider.service';

describe('GoogleLoginComponent', () => {
  let component: GoogleLoginComponent;
  let fixture: ComponentFixture<GoogleLoginComponent>;
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
      imports: [GoogleLoginComponent],
      providers: [
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set provider name to google on loginWithGoogle', async () => {
    await component.loginWithGoogle();
    expect(providerServiceMock.setProviderName).toHaveBeenCalledWith('google');
  });

  it('should call signInWithOAuth on loginWithGoogle', async () => {
    await component.loginWithGoogle();
    expect(authServiceMock.signInWithOAuth).toHaveBeenCalled();
  });

  it('should handle error during signInWithOAuth', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    authServiceMock.signInWithOAuth.mockReturnValue(Promise.reject('OAuth Error'));

    await component.loginWithGoogle();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing in with OAuth:', 'OAuth Error');

    consoleErrorSpy.mockRestore();
  });
  
});
