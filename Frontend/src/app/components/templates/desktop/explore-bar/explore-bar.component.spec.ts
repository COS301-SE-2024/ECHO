import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreBarComponent } from './explore-bar.component';

describe('ExploreBarComponent', () => {
  let component: ExploreBarComponent;
  let fixture: ComponentFixture<ExploreBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
