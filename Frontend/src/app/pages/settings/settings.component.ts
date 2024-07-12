import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { BottomPlayerComponent } from '../../shared/bottom-player/bottom-player.component';
import { SpotifyService } from '../../services/spotify.service';
import { ScreenSizeService } from '../../services/screen-size-service.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgIf,
    BottomPlayerComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent {

  settingName: string = 'Choose a setting';
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
    this.settingName = buttonLabel;
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
