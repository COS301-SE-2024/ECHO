import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TopCardComponent } from './top-card.component';

describe('TopCardComponent', () => {
  let component: TopCardComponent;
  let fixture: ComponentFixture<TopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCardComponent], // Moved TopCardComponent to imports
    }).compileComponents();

    fixture = TestBed.createComponent(TopCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display image, text, and secondary text based on inputs', () => {
    const testImageUrl = 'https://example.com/test-image.jpg';
    const testText = 'Test Text';
    const testSecondaryText = 'Test Secondary Text';

    component.imageUrl = testImageUrl;
    component.text = testText;
    component.secondaryText = testSecondaryText;
    fixture.detectChanges();

    const imageElement = fixture.debugElement.query(By.css('img')).nativeElement;
    const textElement = fixture.debugElement.query(By.css('.text-sm')).nativeElement;
    const secondaryTextElement = fixture.debugElement.query(By.css('.text-xs')).nativeElement;

    expect(imageElement.src).toContain(testImageUrl);
    expect(textElement.textContent).toContain(testText);
    expect(secondaryTextElement.textContent).toContain(testSecondaryText);
  });

  
});
