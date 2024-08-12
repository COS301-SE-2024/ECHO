import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopArtistCardComponent } from './top-artist-card.component';

describe('TopArtistCardComponent', () => {
  let component: TopArtistCardComponent;
  let fixture: ComponentFixture<TopArtistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopArtistCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopArtistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
