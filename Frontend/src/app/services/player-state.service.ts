import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerStateService {
  private currentTrackSource = new BehaviorSubject<any>(null);
  currentTrack$ = this.currentTrackSource.asObservable();

  setCurrentTrack(track: any) {
    this.currentTrackSource.next(track);
  }

  public isReady(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem('readyToPlay') === 'true';
  }

  public setReady() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem('readyToPlay', 'true');
  }
}

