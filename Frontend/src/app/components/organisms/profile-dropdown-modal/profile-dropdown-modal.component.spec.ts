import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDropdownModalComponent } from './profile-dropdown-modal.component';

describe('ProfileDropdownModalComponent', () => {
  let component: ProfileDropdownModalComponent;
  let fixture: ComponentFixture<ProfileDropdownModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDropdownModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDropdownModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
