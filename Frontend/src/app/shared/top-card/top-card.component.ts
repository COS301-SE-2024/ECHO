import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-top-card',
  standalone: true,
  imports: [],
  templateUrl: './top-card.component.html',
  styleUrl: './top-card.component.css'
})
export class TopCardComponent {
  @Input() imageUrl!: string;
  @Input() text!: string;
  @Input() secondaryText!: string;
}
