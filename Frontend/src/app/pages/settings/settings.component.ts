import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent {

  settingName: string = 'Initial Heading';

  constructor(
    protected themeService: ThemeService,
  ) {}

  switchTheme(): void {
    this.themeService.switchTheme();
  }

  showSettings(buttonLabel: string)
  {
    this.settingName = buttonLabel;
  }
}
