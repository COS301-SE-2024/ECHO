import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskLoginComponent } from './desk-login.component';

describe('DeskLoginComponent', () => {
  let component: DeskLoginComponent;
  let fixture: ComponentFixture<DeskLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeskLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeskLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
