import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { AccountComponent } from '../../components/templates/desktop/account/account.component';
import { AudioComponent } from '../../components/templates/desktop/audio/audio.component';
import { DisplayComponent } from '../../components/templates/desktop/display/display.component';
import { LanguageComponent } from '../../components/templates/desktop/language/language.component';
import { PrivacyComponent } from '../../components/templates/desktop/privacy/privacy.component';
import { MoodService } from '../../services/mood-service.service';
import { BackButtonComponent } from '../../components/atoms/back-button/back-button.component';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
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
