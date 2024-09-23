import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoComponent } from './echo.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('EchoComponent', () => {
  let component: EchoComponent;
  let fixture: ComponentFixture<EchoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoComponent],
      providers: [provideHttpClient(),
        ActivatedRoute
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
