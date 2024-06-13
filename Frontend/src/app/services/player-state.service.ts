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
}
