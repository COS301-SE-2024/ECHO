import { TestBed } from '@angular/core/testing';
import { ScreenSizeService } from './screen-size-service.service';

describe('ScreenSizeService', () => {
  let service: ScreenSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenSizeService);
  });

  it('should emit "desktop" when window width is >= 768', (done) => {
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 768});
    service.screenSize$.subscribe(screenSize => {
      expect(screenSize).toEqual('desktop');
      done();
    });
  });

  it('should emit "mobile" when window width is < 768', (done) => {
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 767});
    service.screenSize$.subscribe(screenSize => {
      expect(screenSize).toEqual('mobile');
      done();
    });
  });
});