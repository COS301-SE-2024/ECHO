import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherNavComponent } from './other-nav.component';
import { provideHttpClient } from '@angular/common/http';

describe('OtherNavComponent', () => {
  let component: OtherNavComponent;
  let fixture: ComponentFixture<OtherNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherNavComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
