import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonSongCardComponent } from './skeleton-song-card.component';

describe('SkeletonSongCardComponent', () => {
  let component: SkeletonSongCardComponent;
  let fixture: ComponentFixture<SkeletonSongCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonSongCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
