import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodDropDownComponent } from './mood-drop-down.component';
import { MoodService } from './../../services/mood-service.service';
import { of } from 'rxjs';

// Mock MoodService
const mockMoodService = {
  getCurrentMood: jest.fn(),
  setCurrentMood: jest.fn(),
  getComponentMoodClasses: jest.fn()
};

describe('MoodDropDownComponent', () => {
  let component: MoodDropDownComponent;
  let fixture: ComponentFixture<MoodDropDownComponent>;
  let moodService: MoodService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MoodDropDownComponent ],
      providers: [
        { provide: MoodService, useValue: mockMoodService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodDropDownComponent);
    component = fixture.componentInstance;
    moodService = TestBed.inject(MoodService);
    
    // Set default mock return values
    (moodService.getCurrentMood as jest.Mock).mockReturnValue('Neutral');
    (moodService.getComponentMoodClasses as jest.Mock).mockReturnValue({ 'mood-class': 'example-class' });
    
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current mood and mood component classes', () => {
    expect(component.currentMood).toBe('Neutral');
    expect(component.moodComponentClasses).toEqual({ 'mood-class': 'example-class' });
  });

  it('should toggle dropdown open state', () => {
    expect(component.dropdownOpen).toBeFalsy();
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeTruthy();
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeFalsy();
  });

  it('should call setMood and toggleDropdown when selectMood is called', () => {
    const mood = 'Joy';
    component.selectMood(mood);
    expect(moodService.setCurrentMood).toHaveBeenCalledWith(mood);
    expect(component.dropdownOpen).toBeTruthy();
  });

  it('should call setMood when setMood is called', () => {
    const mood = 'Joy';
    component.setMood(mood);
    expect(moodService.setCurrentMood).toHaveBeenCalledWith(mood);
  });

  it('should return the current mood from moodService when getMood is called', () => {
    expect(component.getMood()).toBe('Neutral');
  });
});
