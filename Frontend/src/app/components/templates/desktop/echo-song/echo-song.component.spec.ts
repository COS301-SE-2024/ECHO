import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoSongComponent } from './echo-song.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EchoSongComponent', () => {
  let component: EchoSongComponent;
  let fixture: ComponentFixture<EchoSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoSongComponent],
      providers: [provideHttpClient(),
        {
          provide: ActivatedRoute,
          params: of({ id: '123' }), // Replace '123' with any relevant ID or parameters
          queryParams: of({ someQueryParam: 'value' }), // Mock queryParams if required
          snapshot: {
            data: {}
          }
        }
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
