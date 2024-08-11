import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsightsComponent } from './insights.component';
import { MoodService } from '../../services/mood-service.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

class MoodServiceMock {
  getComponentMoodClasses = jest.fn().mockReturnValue({});
  getBackgroundMoodClasses = jest.fn().mockReturnValue({});
}

class ScreenSizeServiceMock {
  screenSize$ = of('large');
}

describe('InsightsComponent', () => {
  let component: InsightsComponent;
  let fixture: ComponentFixture<InsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsComponent],
      providers: [
        { provide: MoodService, useClass: MoodServiceMock },
        { provide: ScreenSizeService, useClass: ScreenSizeServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize screenSize on ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.screenSize).toBe('large');
  });

  it('should initialize chart on ngAfterViewChecked', () => {
    jest.spyOn(component, 'createChart').mockReturnValue(Promise.resolve());
    // Ensure the condition to call createChart is met
    component.ngAfterViewChecked();
  });

  it('should get Tailwind color', () => {
    const color = component.getTailwindColor('bg-anger');
    expect(color).toBeDefined();
  });

  it('should create chart', async () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(document.createElement('canvas'));
    await component.createChart();
    expect(component.chart).toBeDefined();
  });

  it('should change chart type on nextChartType', async () => {
    jest.spyOn(component, 'createChart').mockReturnValue(Promise.resolve());
    const initialChartIndex = component.currentChartIndex;
    component.nextChartType();
    expect(component.currentChartIndex).toBe((initialChartIndex + 1) % component.chartTypes.length);
    expect(component.createChart).toHaveBeenCalled();
  });
});