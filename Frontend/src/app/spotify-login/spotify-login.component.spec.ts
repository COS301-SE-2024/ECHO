import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyLoginComponent } from './spotify-login.component';

describe('SpotifyLoginComponent', () => {
  let component: SpotifyLoginComponent;
  let fixture: ComponentFixture<SpotifyLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
