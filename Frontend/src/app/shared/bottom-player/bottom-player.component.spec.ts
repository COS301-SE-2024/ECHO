import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomPlayerComponent } from './bottom-player.component';

describe('BottomPlayerComponent', () => {
  let component: BottomPlayerComponent;
  let fixture: ComponentFixture<BottomPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BottomPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
