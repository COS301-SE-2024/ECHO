import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';
  @Output() close = new EventEmitter<void>(); // Emit an event when the toast needs to be closed
  isVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  showToast(message: string="", type: 'success' | 'error' | 'info') {
    this.message = message;
    this.type = type;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
      this.close.emit(); // Emit close event after 5 seconds
    }, 5000);
  }

  hideToast() {
    this.isVisible = false;
    this.close.emit(); // Also emit close event when manually hiding the toast
  }

  // Get dynamic classes based on the type
  getToastClasses() {
    return {
      'bg-green-500': this.type === 'success',
      'bg-red-500': this.type === 'error',
      'bg-blue-500': this.type === 'info',
      // Add more styles as needed
    };
  }
}
