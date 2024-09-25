import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoComponent } from './echo.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EchoComponent', () => {
  let component: EchoComponent;
  let fixture: ComponentFixture<EchoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoComponent],
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

    fixture = TestBed.createComponent(EchoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
