import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoComponent } from './echo.component';

describe('EchoComponent', () => {
  let component: EchoComponent;
  let fixture: ComponentFixture<EchoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
