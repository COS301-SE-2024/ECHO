import { MobileregisterComponent } from './mobileregister.component';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastComponent } from '../../../../components/organisms/toast/toast.component';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('MobileregisterComponent', () => {
  let component: MobileregisterComponent;
  let fixture: ComponentFixture<MobileregisterComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockAuthService = {
      signUp: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [MobileregisterComponent, ToastComponent,FormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle showModal when toggleModal is called', () => {
    component.showModal = false;
    component.toggleModal();
    expect(component.showModal).toBeTruthy();

    component.toggleModal();
    expect(component.showModal).toBeFalsy();
  });

  it('should toggle showAboutModal when toggleAboutModal is called', () => {
    component.showAboutModal = false;
    component.toggleAboutModal();
    expect(component.showAboutModal).toBeTruthy();

    component.toggleAboutModal();
    expect(component.showAboutModal).toBeFalsy();
  });

  it('should call router.navigate with "/login" when navigateTologin is called', () => {
    component.navigateTologin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show alert if username, email, or password is empty on register', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.username = '';
    component.email = '';
    component.password = '';

    await component.register();

    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('should call authService.signUp and navigate to /home on success', async () => {
    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password123';

    mockAuthService.signUp.mockReturnValue(of({}));
    await component.register();

    expect(mockAuthService.signUp).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      { username: 'testuser', name: 'testuser' }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error toast if authService.signUp fails', async () => {
    const toastComponent = fixture.debugElement.query(By.directive(ToastComponent)).componentInstance;
    jest.spyOn(toastComponent, 'showToast');

    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password123';

    mockAuthService.signUp.mockReturnValue(throwError(() => new Error('Sign-up error')));
    await component.register();

    expect(toastComponent.showToast).toHaveBeenCalledWith(
      'Ensure password contains at least one lower case letter, one capital letter, one number, and one symbol.',
      'error'
    );
  });
});
