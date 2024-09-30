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
          useValue: {
            root: {
              firstChild: {
                snapshot: {
                  routeConfig: {
                    path: 'test-path', // Example path for testing
                  }
                }
              }
            },
            queryParams: of({ trackName: 'Test Track', artistName: 'Test Artist' }), // Mocking the observable
            // Provide necessary properties or methods here
            params: of({}), // You can customize this as needed
            snapshot: {
              params: {}
            }
          }
        },
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
