import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userInput: string = '';
  messages: { sender: string, text: string }[] = [];
  startIndex: number = 0;
  visibleMessagesCount: number = 10;

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', text: this.userInput });
      this.userInput = '';
      // Adjust startIndex to show the latest messages
      this.startIndex = Math.max(0, this.messages.length - this.visibleMessagesCount);
      // Simulate bot response
      setTimeout(() => {
        this.messages.push({ sender: 'bot', text: 'This is a bot response.' });
        // Adjust startIndex to show the latest messages
        this.startIndex = Math.max(0, this.messages.length - this.visibleMessagesCount);
      }, 1000);
    }
  }

  getVisibleMessages() {
    return this.messages.slice(this.startIndex, this.startIndex + this.visibleMessagesCount);
  }

  scrollUp() {
    if (this.startIndex > 0) {
      this.startIndex--;
    }
  }

  scrollDown() {
    if (this.startIndex + this.visibleMessagesCount < this.messages.length) {
      this.startIndex++;
    }
  }

  onScroll(event: WheelEvent) {
    if (event.deltaY < 0) {
      this.scrollUp();
    } else if (event.deltaY > 0) {
      this.scrollDown();
    }
  }
}