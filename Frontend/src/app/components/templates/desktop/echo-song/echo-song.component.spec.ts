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
          useValue: {
            // Mock the parameters as needed
            params: of({ id: '123' }),
            queryParams: of({
              trackName: 'Some Song',
              artistName: 'Some Artist'
            })
            // Add any other properties or methods you use in your component
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
