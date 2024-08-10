import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { BottomPlayerComponent } from '../../shared/bottom-player/bottom-player.component';
import { SpotifyService } from '../../services/spotify.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { AccountComponent } from '../../shared/setting-pages/account/account.component';
import { AudioComponent } from '../../shared/setting-pages/audio/audio.component';
import { DisplayComponent } from '../../shared/setting-pages/display/display.component';
import { LanguageComponent } from '../../shared/setting-pages/language/language.component';
import { PrivacyComponent } from '../../shared/setting-pages/privacy/privacy.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgIf,
    BottomPlayerComponent,
    AccountComponent,
    AudioComponent,
    DisplayComponent,
    LanguageComponent,
    PrivacyComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent {

  activeSetting: string = 'Account';
  screenSize?: string;

  constructor(
    protected themeService: ThemeService,
    private spotifyService: SpotifyService,
        private screenSizeService: ScreenSizeService
  ) {}

  switchTheme(): void {
    this.themeService.switchTheme();
  }

  showSettings(buttonLabel: string)
  {
    this.activeSetting = buttonLabel;
  }

  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
    if (typeof window !== 'undefined') {
      await this.spotifyService.init();
    }
  }
}
