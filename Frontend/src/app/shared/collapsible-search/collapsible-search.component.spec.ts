import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleSearchComponent } from './collapsible-search.component';

describe('CollapsibleSearchComponent', () => {
  let component: CollapsibleSearchComponent;
  let fixture: ComponentFixture<CollapsibleSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollapsibleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
