import { DeskLoginComponent } from './desk-login.component';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ProviderService } from '../../../../services/provider.service';
import { YouTubeService } from '../../../../services/youtube.service';
import { of, throwError } from 'rxjs';
import { ToastComponent } from '../../../../components/organisms/toast/toast.component';

describe('DeskLoginComponent', () => {
  let component: DeskLoginComponent;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let providerServiceMock: jest.Mocked<ProviderService>;
  let youtubeServiceMock: jest.Mocked<YouTubeService>;

  beforeEach(() => {
    // Mocking dependencies
    authServiceMock = {
      signIn: jest.fn(),
      signInWithOAuth: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    providerServiceMock = {
      setProviderName: jest.fn(),
    } as unknown as jest.Mocked<ProviderService>;

    youtubeServiceMock = {
      init: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<YouTubeService>;

    // Creating the component instance with mocks
    component = new DeskLoginComponent(authServiceMock, routerMock, providerServiceMock, youtubeServiceMock);
    component.toastComponent = { showToast: jest.fn() } as unknown as ToastComponent; // Mocking ToastComponent

    jest.clearAllMocks(); // Reset mocks before each test
  });

  describe('ngOnInit', () => {
    it('should initialize the component', () => {
      component.ngOnInit();
      // There's no functionality in ngOnInit, just checking no errors are thrown
      expect(component).toBeTruthy();
    });
  });

  describe('spotify', () => {
    it('should call authService.signInWithOAuth when spotify method is called', async () => {
      await component.spotify();
      expect(authServiceMock.signInWithOAuth).toHaveBeenCalled();
    });
  });

  describe('navigateToRegister', () => {
    it('should navigate to the register page', () => {
      component.navigateToRegister();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      component.email = 'test@example.com';
      component.password = 'password123';
    });

    it('should call providerService.setProviderName and authService.signIn', () => {
      authServiceMock.signIn.mockReturnValue(of({ user: true }));

      component.login();

      expect(providerServiceMock.setProviderName).toHaveBeenCalledWith('email');
      expect(authServiceMock.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should show success toast and navigate to home on successful login', async () => {
      authServiceMock.signIn.mockReturnValue(of({ user: true }));

      component.login();

      expect(component.toastComponent.showToast).toHaveBeenCalledWith('User logged in successfully', 'success');
      expect(localStorage.getItem('username')).toBe('test@example.com');

      setTimeout(() => {
        expect(youtubeServiceMock.init).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
      }, 1000);
    });

    it('should show info toast on invalid login credentials', () => {
      authServiceMock.signIn.mockReturnValue(of({ user: false }));

      component.login();

      expect(component.toastComponent.showToast).toHaveBeenCalledWith('Invalid username or password', 'info');
    });

    it('should show error toast on login failure', () => {
      authServiceMock.signIn.mockReturnValue(throwError(() => new Error('Login error')));

      component.login();

      expect(component.toastComponent.showToast).toHaveBeenCalledWith('There was an issue logging in', 'error');
    });
  });

  describe('modal toggles', () => {
    it('should toggle showModal', () => {
      expect(component.showModal).toBe(false);
      component.toggleModal();
      expect(component.showModal).toBe(true);
      component.toggleModal();
      expect(component.showModal).toBe(false);
    });

    it('should toggle showAboutModal', () => {
      expect(component.showAboutModal).toBe(false);
      component.toggleAboutModal();
      expect(component.showAboutModal).toBe(true);
      component.toggleAboutModal();
      expect(component.showAboutModal).toBe(false);
    });

    it('should toggle showContactModal', () => {
      expect(component.showContactModal).toBe(false);
      component.toggleContactModal();
      expect(component.showContactModal).toBe(true);
      component.toggleContactModal();
      expect(component.showContactModal).toBe(false);
    });

    it('should toggle showPrivacyModal', () => {
      expect(component.showPrivacyModal).toBe(false);
      component.togglePrivacyModal();
      expect(component.showPrivacyModal).toBe(true);
      component.togglePrivacyModal();
      expect(component.showPrivacyModal).toBe(false);
    });

    it('should close all modals when closeModal is called', () => {
      component.showModal = true;
      component.showAboutModal = true;
      component.showContactModal = true;
      component.showPrivacyModal = true;

      component.closeModal();

      expect(component.showModal).toBe(false);
      expect(component.showAboutModal).toBe(false);
      expect(component.showContactModal).toBe(false);
      expect(component.showPrivacyModal).toBe(false);
    });
  });

  describe('google', () => {
    it('should initialize YouTube service and set provider to google', async () => {
      await component.google();

      expect(youtubeServiceMock.init).toHaveBeenCalled();
      expect(providerServiceMock.setProviderName).toHaveBeenCalledWith('google');
    });
  });
});
