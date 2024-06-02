import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodsComponent } from './moods.component';

describe('MoodsComponent', () => {
  let component: MoodsComponent;
  let fixture: ComponentFixture<MoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
