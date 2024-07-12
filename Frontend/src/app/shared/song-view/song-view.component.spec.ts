import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongViewComponent } from './song-view.component';

describe('SongViewComponent', () => {
  let component: SongViewComponent;
  let fixture: ComponentFixture<SongViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
