import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAtomComponent } from './info-atom.component';

describe('InfoAtomComponent', () => {
  let component: InfoAtomComponent;
  let fixture: ComponentFixture<InfoAtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoAtomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoAtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
