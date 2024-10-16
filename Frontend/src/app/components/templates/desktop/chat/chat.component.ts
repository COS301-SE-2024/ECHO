import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  userInput: string = '';

  // Predefined bot responses
  botReplies = [
    "Hello! How can I help you?",
    "I'm here to assist you!",
    "Could you please clarify your question?",
    "Thank you for reaching out!"
  ];

  sendMessage() {
    if (this.userInput.trim() === '') return;

    // Add user message
    this.messages.push({ text: this.userInput, sender: 'user' });
    this.userInput = '';

    // Simulate bot response
    setTimeout(() => {
      const randomReply = this.botReplies[Math.floor(Math.random() * this.botReplies.length)];
      this.messages.push({ text: randomReply, sender: 'bot' });
    }, 1000); // Delay to mimic typing
  }
}