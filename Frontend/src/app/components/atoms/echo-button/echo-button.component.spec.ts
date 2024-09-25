import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoButtonComponent } from './echo-button.component';

describe('EchoButtonComponent', () => {
  let component: EchoButtonComponent;
  let fixture: ComponentFixture<EchoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
