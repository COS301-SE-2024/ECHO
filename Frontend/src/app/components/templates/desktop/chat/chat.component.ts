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

  mockResponse = {
    "answers": [
      {
        "questions": [
          "What is the ECHO Progressive Web App (PWA)?"
        ],
        "answer": "ECHO is a Progressive Web App designed to enhance your music experience by providing personalized song recommendations, sentiment analysis of lyrics, and insightful listening habits. It integrates seamlessly with Spotify to offer a comprehensive music platform.",
        "confidenceScore": 0.7754000000000001,
        "id": 1,
        "source": "Editorial",
        "metadata": {
          "system_metadata_qna_edited_manually": "true"
        },
        "dialog": {
          "isContextOnly": false,
          "prompts": []
        }
      }
    ]
  };

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', text: this.userInput });
      this.userInput = '';
      // Adjust startIndex to show the latest messages
      this.startIndex = Math.max(0, this.messages.length - this.visibleMessagesCount);
      // Simulate bot response
      setTimeout(() => {
        this.handleResponse();
      }, 1000);
    }
  }

  handleResponse() {
    const botResponse = this.mockResponse.answers[0].answer;
    this.messages.push({ sender: 'bot', text: botResponse });
    // Adjust startIndex to show the latest messages
    this.startIndex = Math.max(0, this.messages.length - this.visibleMessagesCount);
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