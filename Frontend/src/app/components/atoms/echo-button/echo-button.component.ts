import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MoodService } from '../../../services/mood-service.service';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-echo-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './echo-button.component.html',
  styleUrls: ['./echo-button.component.css']
})
export class EchoButtonComponent {
  @Input() color: string = '#EE0258';
  @Input() width: string = "1vw";
  @Input() height: string = "vw";
  @Output() buttonClick = new EventEmitter<MouseEvent>();
   moodComponentClasses!: { [key: string]: string };
   constructor(    public moodService: MoodService
    ) {
      this.moodComponentClasses = this.moodService.getMoodColors(); 
  
    } 
  onButtonClick(event: MouseEvent): void {
    this.buttonClick.emit(event);
  }
}
