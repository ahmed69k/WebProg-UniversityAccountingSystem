import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Button],
  templateUrl: './chat-ai.html',
  styleUrls: ['./chat-ai.css']
})
export class ChatAiComponent {
  isToggled:boolean = false
  isClosing: boolean = false;
  isLoading = false;
  userInput = '';
  messages: { sender: 'user' | 'ai', text: string }[] = [];
  private readonly GEMINI_API_KEY = environment.GEMINI_API

  constructor(private ai: GoogleGenAI) {
    // The 'ai' instance is now provided by Angular's DI system.
    // In tests, this will be the mock. In the app, it needs to be provided.
  } 
  
  toggleChatWindow() {
    if (this.isToggled) {
      this.isClosing = true;
      // Wait for the animation to finish before hiding the element
      setTimeout(() => {
        this.isToggled = false;
        this.isClosing = false;
      }, 300); // This should match the CSS transition duration
    } else {
      this.isToggled = true;
    }
  }
  async sendMessage() {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput) return;

    this.messages.push({ sender: 'user', text: trimmedInput });

    const message = trimmedInput;
    this.userInput = ''; 
    this.isLoading = true;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: message }] }],
      });
      
      this.isLoading = false;
      const aiText = response.text || 'Error: No response text received.';
      this.messages.push({ sender: 'ai', text: aiText });
      this.playNotificationSound();
      
    } catch (error) {
      this.isLoading = false;
      console.error("Gemini API Error:", error);
      this.messages.push({ 
        sender: 'ai', 
        text: 'Error: Could not connect to the AI service. Check your API key or network connection.'
      });
    }
  }

  private playNotificationSound(): void {
    const audio = new Audio('assets/notification.mp3');
    audio.play();
  }
}