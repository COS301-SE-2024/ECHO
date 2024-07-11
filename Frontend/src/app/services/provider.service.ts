import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private provider = new BehaviorSubject<string>('default');

  setProviderName(value: string): void {
    localStorage.setItem('provider', value);
  }

  getProviderName(): string {
    let ret = localStorage.getItem('provider');
    if (ret === null) {
      ret = 'default';
    }
    return ret;
  }
}
