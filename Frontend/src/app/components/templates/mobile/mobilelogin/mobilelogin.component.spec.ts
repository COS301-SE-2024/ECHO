import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileloginComponent } from './mobilelogin.component';


describe('MobileloginComponent', () => {
  let component: MobileloginComponent;
  let fixture: ComponentFixture<MobileloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileloginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
