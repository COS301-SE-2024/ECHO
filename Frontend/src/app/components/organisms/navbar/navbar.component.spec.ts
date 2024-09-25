import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ScreenSizeService } from '../../../services/screen-size-service.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let screenSizeService: ScreenSizeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,NavbarComponent],
      providers: [ScreenSizeService],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    screenSizeService = TestBed.inject(ScreenSizeService);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
/*
  it('should navigate to "/home" when homeSvg is selected', fakeAsync(() => {
    jest.spyOn(router, 'navigate').mockImplementation();
    component.select(component.homeSvg);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));
*/
  it('should emit "Home" when homeSvg is selected', () => {
    jest.spyOn(component.selectedNavChange, 'emit').mockImplementation();
    component.select(component.homeSvg);
    expect(component.selectedNavChange.emit).toHaveBeenCalledWith('Home');
  });
});