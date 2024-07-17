import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [NgIf,],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {
  constructor(
    protected themeService: ThemeService,
  ) {}

  switchTheme(): void {
    this.themeService.switchTheme();
  }
}
