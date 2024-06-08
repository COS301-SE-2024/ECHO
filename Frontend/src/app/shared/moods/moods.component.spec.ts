import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodsComponent } from './moods.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MoodsComponent', () => {
  let component: MoodsComponent;
  let fixture: ComponentFixture<MoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatGridListModule, NoopAnimationsModule,MoodsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct favouriteMoods', () => {
    const expectedFavouriteMoods = [
      { name: 'Confident', image: '/assets/moods/Confident.jpg' },
      { name: 'Chill', image: '/assets/moods/chill.jpg' },
      { name: 'Happy', image: '/assets/moods/happy.jpg' },
      { name: 'Melancholy', image: '/assets/moods/Melancholy.png' },
      { name: 'Nostalgic', image: '/assets/moods/Nostalgic.jpg' },
      { name: 'Unknows', image: '/assets/moods/img6.jpg' },
    ];
    expect(component.favouriteMoods).toEqual(expectedFavouriteMoods);
  });

  it('should have correct RecommendedMoods', () => {
    const expectedRecommendedMoods = [
      { name: 'Melancholy', image: '/assets/moods/Melancholy.png' },
      { name: 'Nostalgic', image: '/assets/moods/Nostalgic.jpg' },
      { name: 'Unknows', image: '/assets/moods/img6.jpg' },
      { name: 'Confident', image: '/assets/moods/Confident.jpg' },
      { name: 'Chill', image: '/assets/moods/chill.jpg' },
      { name: 'Happy', image: '/assets/moods/happy.jpg' },
    ];
    expect(component.RecommendedMoods).toEqual(expectedRecommendedMoods);
  });
});