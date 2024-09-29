import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileloginComponent } from './mobilelogin.component';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ProviderService } from '../../../../services/provider.service';
import { YouTubeService } from '../../../../services/youtube.service';
import { ToastComponent } from '../../../../components/organisms/toast/toast.component';
import { of, throwError } from 'rxjs';

class MockToastComponent {
  message: string = '';
  type: "success" | "error" | "info" = 'info';
  isVisible: boolean = false;

  ngOnInit()
  {

  }

  showToast(message: string, type: "success" | "error" | "info") {
      this.message = message;
      this.type = type;
      this.isVisible = true;
  }

  hideToast() 
  {

  }

  getToastClasses()
  {
    
  }

  close() {
      this.isVisible = false;
  }
}

describe('MobileloginComponent', () => {
    let component: MobileloginComponent;
    let fixture: ComponentFixture<MobileloginComponent>;
    let authService: AuthService;
    let router: Router;
    let providerService: ProviderService;
    let youtubeService: YouTubeService;
    let toastComponent: MockToastComponent;

    beforeEach(async () => {
        const authServiceMock = {
            signIn: jest.fn(),
            signInWithOAuth: jest.fn()
        };

        const routerMock = {
            navigate: jest.fn()
        };

        const providerServiceMock = {
            setProviderName: jest.fn()
        };

        const youtubeServiceMock = {
            init: jest.fn()
        };

        const toastComponentMock = {
          showToast: jest.fn(),

      };

        await TestBed.configureTestingModule({
            imports: [MobileloginComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ProviderService, useValue: providerServiceMock },
                { provide: YouTubeService, useValue: youtubeServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MobileloginComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
        providerService = TestBed.inject(ProviderService);
        youtubeService = TestBed.inject(YouTubeService);
        //component.toastComponent = toastComponent; // Simulating the toast component
    });


    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.email).toBe('');
        expect(component.password).toBe('');
        expect(component.username).toBe('');
        expect(component.showModal).toBe(false);
        expect(component.showAboutModal).toBe(false);
        expect(component.showContactModal).toBe(false);
        expect(component.showPrivacyModal).toBe(false);
    });

    it('should call signInWithOAuth when spotify() is called', async () => {
        jest.spyOn(authService, 'signInWithOAuth').mockResolvedValueOnce(undefined);
        await component.spotify();
        expect(authService.signInWithOAuth).toHaveBeenCalled();
    });

    it('should navigate to register page', () => {
        component.navigateToRegister();
        expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });

    /*
    it('should login successfully and navigate to home', () => {
        jest.spyOn(authService, 'signIn').mockReturnValue(of({ user: true }));
        jest.spyOn(youtubeService, 'init').mockResolvedValueOnce(undefined);
        //jest.spyOn(toastComponent, 'showToast');
        
        component.email = 'test@example.com';
        component.password = 'password123';
        
        component.login();

        expect(providerService.setProviderName).toHaveBeenCalledWith('email');
        expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(toastComponent.showToast).toHaveBeenCalledWith('User logged in successfully', 'success');

        // Simulating async behavior
        setTimeout(() => {
            expect(youtubeService.init).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/home']);
        }, 1000);
    });

    it('should show toast for invalid login', () => {
        jest.spyOn(authService, 'signIn').mockReturnValue(of({ user: null }));
        //jest.spyOn(toastComponent, 'showToast');

        component.login();

        expect(toastComponent.showToast).toHaveBeenCalledWith('Invalid username or password', 'info');
    });

    it('should show error toast on login failure', () => {
        jest.spyOn(authService, 'signIn').mockReturnValue(throwError(() => new Error('Login error')));
        //jest.spyOn(toastComponent, 'showToast');

        component.login();

        expect(toastComponent.showToast).toHaveBeenCalledWith('There was an issue logging in', 'error');
    });*/

    it('should toggle the modal visibility', () => {
        component.toggleModal();
        expect(component.showModal).toBe(true);
        component.toggleModal();
        expect(component.showModal).toBe(false);
    });

    it('should toggle the about modal visibility', () => {
        component.toggleAboutModal();
        expect(component.showAboutModal).toBe(true);
        component.toggleAboutModal();
        expect(component.showAboutModal).toBe(false);
    });

    it('should toggle the contact modal visibility', () => {
        component.toggleContactModal();
        expect(component.showContactModal).toBe(true);
        component.toggleContactModal();
        expect(component.showContactModal).toBe(false);
    });

    it('should toggle the privacy modal visibility', () => {
        component.togglePrivacyModal();
        expect(component.showPrivacyModal).toBe(true);
        component.togglePrivacyModal();
        expect(component.showPrivacyModal).toBe(false);
    });

    it('should close all modals', () => {
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

    it('should call init and setProviderName for google()', async () => {
        jest.spyOn(youtubeService, 'init').mockResolvedValueOnce(undefined);
        await component.google();
        expect(youtubeService.init).toHaveBeenCalled();
        expect(providerService.setProviderName).toHaveBeenCalledWith('google');
    });
});
