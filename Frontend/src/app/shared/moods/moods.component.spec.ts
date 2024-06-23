import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodsComponent } from './moods.component';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

describe('MoodsComponent', () => {
  let component: MoodsComponent;
  let fixture: ComponentFixture<MoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, NgForOf, NgIf, NgClass, MatGridListModule, MoodsComponent], // Include standalone component in imports
    }).compileComponents();

    fixture = TestBed.createComponent(MoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct favouriteMoods', () => {
    const expectedFavouriteMoods = [
      { name: 'Anxious', image: '/assets/moods/arctic.jpeg' },
      { name: 'Chill', image: '/assets/moods/kendrick.jpeg' },
      { name: 'Happy', image: '/assets/moods/gambino.jpeg' },
      { name: 'Melancholy', image: '/assets/moods/radiohead.jpeg' },
      { name: 'Nostalgic', image: '/assets/moods/sza.jpeg' },
      { name: 'Unknown', image: '/assets/moods/img6.jpg' },
    ];
    expect(component.favouriteMoods).toEqual(expectedFavouriteMoods);
  });

  it('should have correct RecommendedMoods', () => {
    const expectedRecommendedMoods = [
      { name: 'Mad', image: '/assets/moods/yonce.jpeg' },
      { name: 'Nostalgic', image: '/assets/moods/taylor.jpeg' },
      { name: 'Ethereal', image: '/assets/moods/impala.jpeg' },
      { name: 'Confident', image: '/assets/moods/tyler.jpeg' },
      { name: 'Happy', image: '/assets/moods/beatles.jpeg' },
      { name: 'Introspective', image: '/assets/moods/happy.jpg' },
    ];
    expect(component.RecommendedMoods).toEqual(expectedRecommendedMoods);
  });
});
