import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
//Can add other themes here
@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private darkModeActive: boolean = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            document.body.classList.toggle('dark', this.darkModeActive);
        }
    }

    switchTheme(): void {
        this.darkModeActive = !this.darkModeActive;
        if (isPlatformBrowser(this.platformId)) {
            document.body.classList.toggle('dark', this.darkModeActive);
        }
    }

    isDarkModeActive(): boolean {
        return this.darkModeActive;
    }
}
