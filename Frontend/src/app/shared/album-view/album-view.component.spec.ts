import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumViewComponent } from './album-view.component';

describe('AlbumViewComponent', () => {
  let component: AlbumViewComponent;
  let fixture: ComponentFixture<AlbumViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
