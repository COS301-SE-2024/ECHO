import { Component } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { AccountComponent } from '../..//components/templates/desktop/settings/account/account.component';
import { AudioComponent } from '../../components/templates/desktop/settings/audio/audio.component';
import { DisplayComponent } from '../../components/templates/desktop/settings/display/display.component';
import { LanguageComponent } from '../../components/templates/desktop/settings/language/language.component';
import { PrivacyComponent } from '../../components/templates/desktop/settings/privacy/privacy.component';
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
    private spotifyService: SpotifyService,
    private screenSizeService: ScreenSizeService,
    public moodService: MoodService,
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
  }


  showSettings(buttonLabel: string)
  {
    this.activeSetting = buttonLabel;
  }
  getButtonClass(setting: string): boolean {
    return this.activeSetting === setting ? true : false;
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
