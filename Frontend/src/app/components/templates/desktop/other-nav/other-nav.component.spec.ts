import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherNavComponent } from './other-nav.component';

describe('OtherNavComponent', () => {
  let component: OtherNavComponent;
  let fixture: ComponentFixture<OtherNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
