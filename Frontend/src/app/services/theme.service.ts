import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeActive: boolean = false;

  switchTheme(): void {
    this.darkModeActive = !this.darkModeActive;
    document.body.classList.toggle('dark', this.darkModeActive);
  }

  isDarkModeActive(): boolean {
    return this.darkModeActive;
  }
}