import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { SongViewComponent } from './song-view.component';

class MatDialogRefMock {
  close() {}
}

describe('SongViewComponent', () => {
  let component: SongViewComponent;
  let fixture: ComponentFixture<SongViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongViewComponent,
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
      ]
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
