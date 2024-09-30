import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ScreenSizeService } from '../../../services/screen-size-service.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: any;
  let screenSizeService: any;
  

  beforeEach(async () => {
    screenSizeService = {
      screenSize$: of('large')
    };
    router = {
      events: of(new NavigationEnd(1, '/previousUrl', '/currentUrl')),
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,NavbarComponent],
      providers: [
        {provide: ScreenSizeService, useValue: screenSizeService},
        {provide: Router, useValue: router }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    jest.spyOn(component, 'updateSelectedIcon');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to screenSizeService and set screenSize', fakeAsync(() => {
      fixture.detectChanges(); // Triggers ngOnInit

      tick();

      expect(component.screenSize).toBe('large');
    }));

    it('should subscribe to router events and call updateSelectedIcon on NavigationEnd', fakeAsync(() => {
      jest.spyOn(component, 'updateSelectedIcon');

      fixture.detectChanges(); // Triggers ngOnInit

      tick();

      expect(component.updateSelectedIcon).toHaveBeenCalledWith('/currentUrl');
    }));
  });
/*
  it('should navigate to "/home" when homeSvg is selected', fakeAsync(() => {
    jest.spyOn(router, 'navigate').mockImplementation();
    component.select(component.homeSvg);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));
*/
  describe('select', () => {
    it('should emit "Home" when homeSvg is selected', () => {
      jest.spyOn(component.selectedNavChange, 'emit').mockImplementation();
      component.select(component.homeSvg);
      expect(component.selectedNavChange.emit).toHaveBeenCalledWith('Home');
    });
    it('should emit "Insight" when insightSvg is selected', () => {
      jest.spyOn(component.selectedNavChange, 'emit').mockImplementation();
      component.select(component.insightSvg);
      expect(component.selectedNavChange.emit).toHaveBeenCalledWith('Insight');
    });
    it('should emit "Library" when otherSvg2 is selected', () => {
      jest.spyOn(component.selectedNavChange, 'emit').mockImplementation();
      component.select(component.otherSvg2);
      expect(component.selectedNavChange.emit).toHaveBeenCalledWith('Library');
    });
  });

  describe('updateSelectedIcon', () => {
    it('should set the svg to home', () => {
      let url = "fakeurl/home";

      component.updateSelectedIcon(url);

      expect(component.selectedSvg).toEqual(component.homeSvg)
    });
    it('should set the svg to insights', () => {
      let url = "fakeurl/insights";

      component.updateSelectedIcon(url);

      expect(component.selectedSvg).toEqual(component.insightSvg)
    });
    it('should set the svg to library', () => {
      let url = "fakeurl/library";

      component.updateSelectedIcon(url);

      expect(component.selectedSvg).toEqual(component.otherSvg2)
    });
    it('should set the svg to default', () => {
      let url = "fakeurl/somthingAwesome";

      component.updateSelectedIcon(url);

      expect(component.selectedSvg).toEqual('');
    });
  });

  describe('getCurrentButtonClass', () => {
    it('should return "bg-pink" when the option is selected', () => {
      component.currentSelection = 'option1';

      const result = component.getCurrentButtonClass('option1');

      expect(result).toBe('bg-pink');
    });

    it('should return "bg-gray-component" when the option is not selected', () => {
        component.currentSelection = 'option2';

        const result = component.getCurrentButtonClass('option1');

        expect(result).toBe('bg-gray-component');
    });
  });
});