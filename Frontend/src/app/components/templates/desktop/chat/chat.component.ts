import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoodService } from '../../../../services/mood-service.service';
import { DolphinComponent } from '../../../atoms/dolphin/dolphin.component';
import { ChatService } from '../../../../chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DolphinComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userInput: string = '';
  messages: { sender: string, text: string }[] = [];
  startIndex: number = 0;
  visibleMessagesCount: number = 10;
  moodColors!: { [key: string]: string };
  moodColorsButton!: { [key: string]: string };

  constructor(public moodService: MoodService, private chatService: ChatService) { 
    this.moodColors = moodService.getUnerlineMoodClasses();
    this.moodColorsButton = moodService.getComponentMoodClasses();
  }

  sendMessage() {
    if (this.userInput.trim()) {
      let temp = this.userInput.toLowerCase();
      if(temp == 'clear')
      {
        this.messages = [];
        return;
      }
      this.messages.push({ sender: 'user', text: this.userInput });
      const userMessage = this.userInput;
      this.userInput = '';
      // Adjust startIndex to show the latest messages
      this.startIndex = Math.max(0, this.messages.length - this.visibleMessagesCount);
      // Send user input to the chat service and handle the response
      this.chatService.getBotResponse(userMessage).subscribe(response => {
        this.handleResponse(response);
      });
    }
  }

  handleResponse(response: any) {
    const botResponse = response.answers[0].answer;
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