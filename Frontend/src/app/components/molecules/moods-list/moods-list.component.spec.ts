import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodsListComponent } from './moods-list.component';

describe('MoodsListComponent', () => {
  let component: MoodsListComponent;
  let fixture: ComponentFixture<MoodsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
