import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskRegisterComponent } from './desk-register.component';
import { provideHttpClient } from '@angular/common/http';

describe('DeskRegisterComponent', () => {
  let component: DeskRegisterComponent;
  let fixture: ComponentFixture<DeskRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeskRegisterComponent],
      providers: [
        provideHttpClient(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeskRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
