import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftComponent } from './left.component';
import { provideHttpClient } from '@angular/common/http';

describe('LeftComponent', () => {
  let component: LeftComponent;
  let fixture: ComponentFixture<LeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
