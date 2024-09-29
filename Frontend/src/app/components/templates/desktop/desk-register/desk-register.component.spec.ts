import { DeskRegisterComponent } from './desk-register.component';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastComponent } from '../../../../components/organisms/toast/toast.component';

describe('DeskRegisterComponent', () => {
  let component: DeskRegisterComponent;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    // Mocking AuthService and Router
    authServiceMock = {
      signUp: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    // Creating component instance with mocks
    component = new DeskRegisterComponent(authServiceMock, routerMock);
    component.toastComponent = { showToast: jest.fn() } as unknown as ToastComponent; // Mocking ToastComponent

    jest.clearAllMocks(); // Resetting mocks before each test
  });

  describe('register', () => {
    it('should show an alert if fields are empty', async () => {
      window.alert = jest.fn(); // Mocking global alert
      component.username = '';
      component.email = '';
      component.password = '';

      await component.register();

      expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
    });

    it('should call authService.signUp and navigate to home on success', async () => {
      component.username = 'testuser';
      component.email = 'test@example.com';
      component.password = 'Test123!';
      authServiceMock.signUp.mockReturnValue(of({}));

      await component.register();

      expect(authServiceMock.signUp).toHaveBeenCalledWith('test@example.com', 'Test123!', {
        username: 'testuser',
        name: 'testuser',
      });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should call toastComponent.showToast on signUp error', async () => {
      component.username = 'testuser';
      component.email = 'test@example.com';
      component.password = 'Test123!';
      authServiceMock.signUp.mockReturnValue(throwError(() => new Error('Sign up error')));

      await component.register();

      expect(authServiceMock.signUp).toHaveBeenCalledWith('test@example.com', 'Test123!', {
        username: 'testuser',
        name: 'testuser',
      });
      expect(component.toastComponent.showToast).toHaveBeenCalledWith(
        'Ensure password contains at least one lower case letter, one capital letter, one number, and one symbol.',
        'error'
      );
    });
  });

  describe('navigation', () => {
    it('should navigate to the login page when navigateTologin is called', () => {
      component.navigateTologin();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
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

  describe('spotify login', () => {
    it('should redirect to the correct URL when spotify is called', () => {
      const originalLocation = window.location;
      
      // Mocking window.location.href
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });
  
      component.spotify();
  
      expect(window.location.href).toBe('http://localhost:3000/api/auth/oauth-signin');
  
      // Restore the original window.location after the test
      window.location = originalLocation;
    });
  });
});
