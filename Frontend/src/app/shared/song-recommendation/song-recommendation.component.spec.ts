import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongRecommendationComponent } from './song-recommendation.component';

describe('SongRecommendationComponent', () => {
  let component: SongRecommendationComponent;
  let fixture: ComponentFixture<SongRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongRecommendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
