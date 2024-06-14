import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLibraryComponent } from './user-library.component';

describe('UserLibraryComponent', () => {
  let component: UserLibraryComponent;
  let fixture: ComponentFixture<UserLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
