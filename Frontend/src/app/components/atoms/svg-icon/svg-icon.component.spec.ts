import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconComponent } from './svg-icon.component';
import { By } from '@angular/platform-browser';
import { MoodService } from '../../../services/mood-service.service';

describe('SvgIconComponent', () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;
  let mockMoodService: any;
  beforeEach(async () => {
    // Mock ThemeService or any other dependencies
    mockMoodService = {
      getCurrentMood: jest.fn(),
      getComponentMoodClasses: jest.fn(),

    }
    await TestBed.configureTestingModule({
      imports: [SvgIconComponent],
      providers: [
        {provide: MoodService, useValue: mockMoodService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit svgClick event when clicked', () => {
    jest.spyOn(component.svgClick, 'emit');
    const svgElement = fixture.debugElement.query(By.css('svg'));
    svgElement.triggerEventHandler('click', null);
    expect(component.svgClick.emit).toHaveBeenCalled();
  });

  describe('circleColor',() => {
    it('should return the class for the current mood when hovered is false', () => {
      mockMoodService.getCurrentMood.mockReturnValue('happy');
      component.hovered = false;

      component.moodComponentClasses = {
        happy: 'happy-class',
        sad: 'sad-class',
        excited: 'excited-class'
      };
      const result = component.circleColor();
      expect(result).toBe('happy-class');
      expect(mockMoodService.getCurrentMood).toHaveBeenCalled();
    });
  
    it('should return the class for the provided mood when hovered is true and mood is defined', () => {
      component.moodComponentClasses = {
        happy: 'happy-class',
        sad: 'sad-class',
        excited: 'excited-class'
      };
      component.hovered = true;
      component.mood = 'sad';
      const result = component.circleColor();
      expect(result).toBe('sad-class');
    });
  
    it('should return the class for the current mood when hovered is true and mood is undefined', () => {
      const mockCurrentMood = 'happy';
      component.moodService.getCurrentMood = jest.fn().mockReturnValue(mockCurrentMood);

      component.moodComponentClasses = {
        happy: 'happy-class',
        sad: 'sad-class',
        excited: 'excited-class'
      };

      component.hovered = true;
      component.mood = undefined;

      const result = component.circleColor();
      expect(result).toBe('happy-class');
      expect(mockMoodService.getCurrentMood).toHaveBeenCalled();
    });
  });

  it('should set hovered to true and isAnimating to true if circleAnimation is true on mouse enter', () => {
    component.circleAnimation = true;
    
    component.onMouseEnter();
    
    expect(component.hovered).toBe(true);
    expect(component.isAnimating).toBe(true);
  });
  
  it('should set hovered to true but not set isAnimating if circleAnimation is false on mouse enter', () => {
    component.circleAnimation = false;
    
    component.onMouseEnter();
    
    expect(component.hovered).toBe(true);
    expect(component.isAnimating).toBe(false);
  });

  it('should set hovered to false and isAnimating to false if circleAnimation is true on mouse leave', () => {
    component.circleAnimation = true;
    
    component.onMouseLeave();
    
    expect(component.hovered).toBe(false);
    expect(component.isAnimating).toBe(false);
  });
  
  it('should set hovered to false but not set isAnimating if circleAnimation is false on mouse leave', () => {
    component.circleAnimation = false;
    
    component.onMouseLeave();
    
    expect(component.hovered).toBe(false);
    expect(component.isAnimating).toBe(false);
  });

  it('should set hovered to true and isAnimating to true if circleAnimation is true on mouse enter path', () => {
    component.circleAnimation = true;
    
    component.onMouseEnterPath();
    
    expect(component.hovered).toBe(true);
    expect(component.isAnimating).toBe(true);
  });
  
  it('should set hovered to true but not set isAnimating if circleAnimation is false on mouse enter path', () => {
    component.circleAnimation = false;
    
    component.onMouseEnterPath();
    
    expect(component.hovered).toBe(true);
    expect(component.isAnimating).toBe(false);
  });

  it('should set hovered to false and isAnimating to false if circleAnimation is true on mouse leave path', () => {
    component.circleAnimation = true;
    
    component.onMouseLeavePath();
    
    expect(component.hovered).toBe(false);
    expect(component.isAnimating).toBe(false);
  });
  
  it('should set hovered to false but not set isAnimating if circleAnimation is false on mouse leave path', () => {
    component.circleAnimation = false;
    
    component.onMouseLeavePath();
    
    expect(component.hovered).toBe(false);
    expect(component.isAnimating).toBe(false);
  });

  it('should return a numeric value from pathHeight', () => {
    component.pathHeight = '100.5';
    
    const result = component.getNumericPathHeight();
    
    expect(result).toBe(100.5);
  });
  
  it('should return NaN if pathHeight is not a valid number', () => {
    component.pathHeight = 'invalid';
    
    const result = component.getNumericPathHeight();
    
    expect(result).toBeNaN();
  });
  
});