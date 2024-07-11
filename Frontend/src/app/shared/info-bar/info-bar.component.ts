import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-info-bar',
  standalone: true,
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.css'],
  imports: [MatCard, MatCardContent, NgForOf, NgIf, NgClass],
})
export class InfoBarComponent {
  selectedOption: string = 'Info';

  @Input() artist: any;

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
