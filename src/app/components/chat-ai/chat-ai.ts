import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat-ai.html',
  styleUrls: ['./chat-ai.css']
})
export class ChatAiComponent {
  userInput = '';
  messages: { sender: 'user' | 'ai', text: string }[] = [];
  private readonly GEMINI_API_KEY = environment.GEMINI_API
  ai: GoogleGenAI = new GoogleGenAI({ apiKey: this.GEMINI_API_KEY });

  constructor() {} 

  async sendMessage() {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput) return;

    this.messages.push({ sender: 'user', text: trimmedInput });
    
    const message = trimmedInput;
    this.userInput = ''; 

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: message }] }],
      });

      const aiText = response.text || 'Error: No response text received.';
      this.messages.push({ sender: 'ai', text: aiText });
      
    } catch (error) {
      console.error("Gemini API Error:", error);
      this.messages.push({ 
        sender: 'ai', 
        text: 'Error: Could not connect to the AI service. Check your API key or network connection.'
      });
    }
  }
}