import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodListComponent } from './mood-list.component';

describe('MoodListComponent', () => {
  let component: MoodListComponent;
  let fixture: ComponentFixture<MoodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
