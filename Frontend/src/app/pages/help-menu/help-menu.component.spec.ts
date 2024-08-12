import { TestBed } from '@angular/core/testing';
import { HelpMenuComponent } from './help-menu.component';
import { MoodService } from '../../services/mood-service.service';
import { By } from '@angular/platform-browser';

describe('HelpMenuComponent', () => {
  let component: HelpMenuComponent;
  let fixture: any;
  let moodServiceMock: any;

  beforeEach(async () => {
    moodServiceMock = {
      getCurrentMood: jest.fn(),
      getComponentMoodClasses: jest.fn(),
      getBackgroundMoodClasses: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HelpMenuComponent],
      providers: [{ provide: MoodService, useValue: moodServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the HelpMenuComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentMood, moodComponentClasses, and backgroundMoodClasses from MoodService', () => {
    moodServiceMock.getCurrentMood.mockReturnValue('happy');
    moodServiceMock.getComponentMoodClasses.mockReturnValue({ 'happy': 'text-blue-500' });
    moodServiceMock.getBackgroundMoodClasses.mockReturnValue({ 'happy': 'bg-blue-500' });

    component.ngOnInit();

    expect(component.currentMood).toBe('happy');
    expect(component.moodComponentClasses).toEqual({ 'happy': 'text-blue-500' });
    expect(component.backgroundMoodClasses).toEqual({ 'happy': 'bg-blue-500' });
  });

  it('should toggle the accordion when toggleAccordion is called', () => {
    const section = 'home';
    expect(component.isAccordionOpen(section)).toBe(false);

    component.toggleAccordion(section);
    expect(component.isAccordionOpen(section)).toBe(true);

    component.toggleAccordion(section);
    expect(component.isAccordionOpen(section)).toBe(false);
  });

  it('should show and hide the accordion content when buttons are clicked', () => {
    const section = 'home';
    const button = fixture.debugElement.query(By.css('button'));
    
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isAccordionOpen(section)).toBe(true);
    expect(fixture.debugElement.query(By.css('.block'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.hidden'))).toBeFalsy();

    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isAccordionOpen(section)).toBe(false);
    expect(fixture.debugElement.query(By.css('.block'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.hidden'))).toBeTruthy();
  });
});
