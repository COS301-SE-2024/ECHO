import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAtomicComponent } from './profile.component';
import { provideHttpClient } from '@angular/common/http';

describe('ProfileComponent', () => {
  let component: ProfileAtomicComponent;
  let fixture: ComponentFixture<ProfileAtomicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAtomicComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAtomicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
