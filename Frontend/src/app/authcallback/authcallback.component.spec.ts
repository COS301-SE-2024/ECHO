import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthcallbackComponent } from './authcallback.component';

describe('AuthcallbackComponent', () => {
  let component: AuthcallbackComponent;
  let fixture: ComponentFixture<AuthcallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthcallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthcallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
