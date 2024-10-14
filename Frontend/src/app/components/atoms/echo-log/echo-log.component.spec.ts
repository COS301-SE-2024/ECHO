import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoLogComponent } from './echo-log.component';

describe('EchoLogComponent', () => {
  let component: EchoLogComponent;
  let fixture: ComponentFixture<EchoLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchoLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
