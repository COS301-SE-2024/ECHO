import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{
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
          // Provide necessary properties or methods here
          params: of({}), // You can customize this as needed
          snapshot: {
            params: {}
          }
        }
      },
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
