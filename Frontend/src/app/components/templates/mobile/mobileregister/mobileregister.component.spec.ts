import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileregisterComponent } from './mobileregister.component';
import { provideHttpClient } from '@angular/common/http';

describe('MobileregisterComponent', () => {
  let component: MobileregisterComponent;
  let fixture: ComponentFixture<MobileregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileregisterComponent],
      providers: [
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
