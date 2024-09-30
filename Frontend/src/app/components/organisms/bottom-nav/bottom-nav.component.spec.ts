import { BottomNavComponent } from './bottom-nav.component';
import { MoodService } from "./../../../services/mood-service.service";
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

// Mocking Router with jest.Mocked<>
const mockRouter = (): jest.Mocked<Router> => ({
  navigate: jest.fn() // Mock the 'navigate' method
} as any); // Cast to `any` to avoid errors from optional methods in Router

const mockMoodService = (): jest.Mocked<MoodService> => ({
  getMoodColors: jest.fn().mockReturnValue({ happy: '#ff0', sad: '#00f' }),
  getComponentMoodClassesDark: jest.fn().mockReturnValue({ happy: 'dark-happy', sad: 'dark-sad' }),
  getCurrentMood: jest.fn().mockReturnValue('happy'),
} as any); // Cast to `any` for mocking specific methods

describe('BottomNavComponent', () => {
  let component: BottomNavComponent;
  let fixture: ComponentFixture<BottomNavComponent>;
  
  let moodService: jest.Mocked<MoodService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {

    router = mockRouter();
    moodService = mockMoodService();

    // Initialize the component with the mocked router and moodService
    await TestBed.configureTestingModule({
      imports: [BottomNavComponent],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: router },
        MoodService,

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BottomNavComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home when goHome is called', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /search when goSearch is called', () => {
    component.goSearch();
    expect(router.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should navigate to /insights when goInsights is called', () => {
    component.goInsights();
    expect(router.navigate).toHaveBeenCalledWith(['/insights']);
  });

  it('should navigate to /library when goLibrary is called', () => {
    component.goLibrary();
    expect(router.navigate).toHaveBeenCalledWith(['/library']);
  });
});