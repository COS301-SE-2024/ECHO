import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponentComponent } from './button-component.component';

describe('ButtonComponentComponent', () => {
  let component: ButtonComponentComponent;
  let fixture: ComponentFixture<ButtonComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
