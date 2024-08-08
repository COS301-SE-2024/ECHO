import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodDropDownComponent } from './mood-drop-down.component';

describe('MoodDropDownComponent', () => {
  let component: MoodDropDownComponent;
  let fixture: ComponentFixture<MoodDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodDropDownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
