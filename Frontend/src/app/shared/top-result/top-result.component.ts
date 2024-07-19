// In top-result.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-result',
  standalone: true,
  templateUrl: './top-result.component.html',
  styleUrls: ['./top-result.component.css']
})
export class TopResultComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() imageSrc: string = '';
}