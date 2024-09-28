import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponentview } from './../login/login.component';
import { provideHttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponentview;
  let fixture: ComponentFixture<LoginComponentview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponentview],
      providers: [
        provideHttpClient(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponentview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
