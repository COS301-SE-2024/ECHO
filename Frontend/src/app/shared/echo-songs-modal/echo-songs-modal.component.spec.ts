import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoSongsModalComponent } from './echo-songs-modal.component';

describe('EchoSongsModalComponent', () => {
  let component: EchoSongsModalComponent;
  let fixture: ComponentFixture<EchoSongsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoSongsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchoSongsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
