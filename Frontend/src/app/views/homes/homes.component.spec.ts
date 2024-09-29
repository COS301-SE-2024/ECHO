import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomesComponent } from './homes.component';
import { provideHttpClient } from '@angular/common/http';

describe('HomesComponent', () => {
  let component: HomesComponent;
  let fixture: ComponentFixture<HomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomesComponent],
      providers: [
      provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
