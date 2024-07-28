import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';
import { SearchService } from '../../services/search.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { of } from 'rxjs';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let screenSizeServiceMock: any;
  let searchServiceMock: any;

  beforeEach(async () => {

    screenSizeServiceMock = {
      screenSize$: of('large')
    };

    searchServiceMock = {
      storeSearch: jest.fn().mockReturnValue(of({})),
      storeAlbumSearch: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [
        { provide: ScreenSizeService, useValue: screenSizeServiceMock },
        { provide: SearchService, useValue: searchServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearchSubmit', () => {
    it('should emit searchDown and call searchService on search submit', () => {
      jest.spyOn(component.searchDown, 'emit');
      const searchQuery = 'test query';
      component.searchQuery = searchQuery;
  
      component.onSearchSubmit();
  
      expect(component.searchDown.emit).toHaveBeenCalledWith(searchQuery);
      expect(searchServiceMock.storeSearch).toHaveBeenCalledWith(searchQuery);
      expect(searchServiceMock.storeAlbumSearch).toHaveBeenCalledWith(searchQuery);
    });
  });
});
