import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-component',
  standalone: true,
  imports: [],
  template: `<button [ngClass]="type">{{ label }}</button>`,
  styleUrl: './button-component.component.css'
})
export class ButtonComponentComponent {
  @Input() label: string = '';
  @Input() type: string = 'primary';
}
