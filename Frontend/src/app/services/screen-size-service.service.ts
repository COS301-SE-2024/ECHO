import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {

  private checkScreenSize() {
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  public screenSize$: Observable<string> = fromEvent(window, 'resize').pipe(
    startWith(this.checkScreenSize()),
    map(() => this.checkScreenSize())
  );

  constructor() { }
}