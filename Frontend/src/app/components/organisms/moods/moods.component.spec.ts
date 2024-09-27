import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodsComponent } from './moods.component';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { provideHttpClient } from '@angular/common/http';

describe('MoodsComponent', () => {
  let component: MoodsComponent;
  let fixture: ComponentFixture<MoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, NgForOf, NgIf, NgClass, MatGridListModule, MoodsComponent], // Include standalone component in imports
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
/*
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
*/
  /*
  it('should have correct RecommendedMoods', () => {
    const expectedRecommendedMoods = [
      {
             "image": "/assets/moods/arctic.jpeg",
             "name": "Neutral",
           },
          {
             "image": "/assets/moods/kendrick.jpeg",
             "name": "Anger",
           },
           {
             "image": "/assets/moods/gambino.jpeg",
             "name": "Admiration",
           },
           {
             "image": "/assets/moods/yonce.jpeg",
             "name": "Fear",
           },
           {
             "image": "/assets/moods/taylor.jpeg",
             "name": "Joy",
           },
           {
             "image": "/assets/moods/impala.jpeg",
             "name": "Amusement",
           },
           {
             "image": "/assets/moods/arctic.jpeg",
             "name": "Annoyance",
           },
           {
             "image": "/assets/moods/kendrick.jpeg",
             "name": "Approval",
           },
           {
             "image": "/assets/moods/gambino.jpeg",
             "name": "Caring",
           },
           {
             "image": "/assets/moods/yonce.jpeg",
             "name": "Confusion",
           },
           {
             "image": "/assets/moods/taylor.jpeg",
             "name": "Nostalgic",
           },
           {
             "image": "/assets/moods/impala.jpeg",
             "name": "Desire",
           },
           {
             "image": "/assets/moods/tyler.jpeg",
             "name": "Confident",
           },
           {
             "image": "/assets/moods/beatles.jpeg",
             "name": "Happy",
            },
            {
             "image": "/assets/moods/happy.jpg",
             "name": "Introspective",
           },
           {
             "image": "/assets/moods/yonce.jpeg",
             "name": "Embarrassment",
           },
           {
             "image": "/assets/moods/taylor.jpeg",
             "name": "Excitement",
           },
           {
             "image": "/assets/moods/impala.jpeg",
             "name": "Gratitude",
           },
           {
             "image": "/assets/moods/arctic.jpeg",
             "name": "Grief",
           },
           {
             "image": "/assets/moods/kendrick.jpeg",
             "name": "Love",
           },
           {
             "image": "/assets/moods/gambino.jpeg",
             "name": "Nervousness",
           },
           {
             "image": "/assets/moods/yonce.jpeg",
             "name": "Optimism",
           },
           {
             "image": "/assets/moods/taylor.jpeg",
             "name": "Pride",
           },
           {
             "image": "/assets/moods/impala.jpeg",
             "name": "Realisation",
           },
           {
             "image": "/assets/moods/arctic.jpeg",
             "name": "Relief",
           },
           {
             "image": "/assets/moods/kendrick.jpeg",
             "name": "Remorse",
           },
          {
             "image": "/assets/moods/gambino.jpeg",
             "name": "Sadness",
           },
         {
            "image": "/assets/moods/yonce.jpeg",
            "name": "Surprise",
            },
    ];
    //expect(component.RecommendedMoods).toEqual(expectedRecommendedMoods);
  });
  */
});
