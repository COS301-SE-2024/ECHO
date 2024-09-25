import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableIconComponent } from './expandable-icon.component';

describe('ExpandableIconComponent', () => {
  let component: ExpandableIconComponent;
  let fixture: ComponentFixture<ExpandableIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandableIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
