import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoSongComponent } from './echo-song.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('EchoSongComponent', () => {
  let component: EchoSongComponent;
  let fixture: ComponentFixture<EchoSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoSongComponent],
      providers: [provideHttpClient(),
        ActivatedRoute
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchoSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
