import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private provider = new BehaviorSubject<string>('email');

  // Method to set the provider
  setProviderName(providerName: string): void {
    this.provider.next(providerName);
  }

  // Method to get the current provider value
  getProviderName(): string {
    const currentValue = this.provider.getValue();
    return currentValue;
  }

  // Method to clear the provider
  clearProviderName(): void {
    this.provider.next('email');
  }

  ngOnDestroy() {
    this.clearProviderName();
  }
}
