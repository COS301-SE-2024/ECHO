import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsightsComponent } from './insights.component';
import { MoodService } from '../../services/mood-service.service';
import { isPlatformBrowser } from '@angular/common';
import Chart, { ChartType } from 'chart.js/auto';

// Mock the Chart.js module
// Mock the Chart.js module
jest.mock('chart.js/auto', () => {
  return {
    Chart: jest.fn().mockImplementation(() => {
      return {
        destroy: jest.fn(), // Mock the destroy method
      };
    }),
    getChart: jest.fn().mockReturnValue(null), // Make sure getChart returns null by default
  };
});

describe('InsightsComponent', () => {
  let component: InsightsComponent;
  let fixture: ComponentFixture<InsightsComponent>;
  let moodService: MoodService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsComponent],
      providers: [
        {
          provide: MoodService,
          useValue: { /* mock your MoodService methods here */ }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InsightsComponent);
    component = fixture.componentInstance;
    moodService = TestBed.inject(MoodService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
