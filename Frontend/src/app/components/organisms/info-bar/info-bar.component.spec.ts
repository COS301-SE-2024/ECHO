import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoBarComponent } from './info-bar.component';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InfoBarComponent', () => {
  let component: InfoBarComponent;
  let fixture: ComponentFixture<InfoBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatCardModule, NoopAnimationsModule, InfoBarComponent, InfoBarComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('should display artist info by default', () => {
    const nameElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(nameElement.textContent).toContain(component.artist.name);
  });
*/
/*
  it('should switch to Top Songs view when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('.button-container:nth-child(2) button')).nativeElement;
    button.click();
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(nameElement.textContent).toContain(`${component.artist.name}'s Top Songs`);
  });
*/
/*
  it('should display artist debut, description, genres, and similar artists in Info view', () => {
    component.selectedOption = 'Info';
    fixture.detectChanges();

    const debutElement = fixture.debugElement.query(By.css('p:nth-of-type(1)')).nativeElement;
    const descriptionElement = fixture.debugElement.query(By.css('p:nth-of-type(2)')).nativeElement;
    const genresElement = fixture.debugElement.query(By.css('p:nth-of-type(3)')).nativeElement;
    const similarArtistsElement = fixture.debugElement.query(By.css('p:nth-of-type(4)')).nativeElement;

    expect(debutElement.textContent).toContain(`Debut: ${component.artist.debut}`);
    expect(descriptionElement.textContent).toContain(`Description: ${component.artist.description}`);
    expect(genresElement.textContent).toContain(`Genres: ${component.artist.genres.join(', ')}`);
    expect(similarArtistsElement.textContent).toContain(`More Artists Like Them: ${component.artist.similarArtists.join(', ')}`);
  });
*/
/*
  it('should display top songs in Top Songs view', () => {
    component.selectedOption = 'TopSongs';
    fixture.detectChanges();

    const topSongsElements = fixture.debugElement.queryAll(By.css('li'));
    expect(topSongsElements.length).toBe(component.artist.topSongs.length);
    for (let i = 0; i < topSongsElements.length; i++) {
      expect(topSongsElements[i].nativeElement.textContent).toContain(component.artist.topSongs[i]);
    }
  });
  */
});
