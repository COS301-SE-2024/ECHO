import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigRoundedSquareCardComponent } from './big-rounded-square-card.component';

describe('BigRoundedSquareCardComponent', () => {
  let component: BigRoundedSquareCardComponent;
  let fixture: ComponentFixture<BigRoundedSquareCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigRoundedSquareCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigRoundedSquareCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
