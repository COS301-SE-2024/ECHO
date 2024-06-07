import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private checkScreenSize() {
    return isPlatformBrowser(this.platformId) && window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  public screenSize$: Observable<string>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenSize$ = fromEvent(window, 'resize').pipe(
        startWith(this.checkScreenSize()),
        map(() => this.checkScreenSize())
      );
    } else {
      this.screenSize$ = of('desktop');
    }
  }
}