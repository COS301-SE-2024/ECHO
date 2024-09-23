import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCardsComponent } from './song-cards.component';
import { provideHttpClient } from '@angular/common/http';

describe('SongCardsComponent', () => {
  let component: SongCardsComponent;
  let fixture: ComponentFixture<SongCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCardsComponent]
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
