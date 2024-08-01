import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponentComponent } from './input-component.component';

describe('InputComponentComponent', () => {
  let component: InputComponentComponent;
  let fixture: ComponentFixture<InputComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
