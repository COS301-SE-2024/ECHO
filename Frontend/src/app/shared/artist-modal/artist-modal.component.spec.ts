import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistModalComponent } from './artist-modal.component';

describe('ArtistModalComponent', () => {
  let component: ArtistModalComponent;
  let fixture: ComponentFixture<ArtistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
