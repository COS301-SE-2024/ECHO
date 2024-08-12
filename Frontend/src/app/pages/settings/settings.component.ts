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
import { MoodService } from '../../services/mood-service.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    BottomPlayerComponent,
    AccountComponent,
    AudioComponent,
    DisplayComponent,
    LanguageComponent,
    PrivacyComponent,
    BackButtonComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent {

  activeSetting: string = 'Account';
  screenSize?: string;
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  constructor(
    protected themeService: ThemeService,
    private spotifyService: SpotifyService,
    private screenSizeService: ScreenSizeService,
    public moodService: MoodService,
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
  }

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
