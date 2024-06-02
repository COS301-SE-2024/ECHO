import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-bottom-player',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    NgIf,
  ],
  templateUrl: './bottom-player.component.html',
  styleUrl: './bottom-player.component.css'
})
export class BottomPlayerComponent {
  constructor(protected themeService: ThemeService) {
  }

}
