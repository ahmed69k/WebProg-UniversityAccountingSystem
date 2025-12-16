import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChatAiComponent } from './chat-ai';
import { Button } from '../../shared/button/button';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';

// Mock GoogleGenAI to control its behavior
class MockGoogleGenAI {
  models = {
    generateContent: jasmine.createSpy('generateContent').and.returnValue(
      Promise.resolve({ text: 'Mock AI response' })
    )
  };
  // The constructor is not needed for the mock
}

// Mock Audio to prevent actual sound playback during tests
class MockAudio {
  play = jasmine.createSpy('play');
  constructor(src: string) {}
}

describe('ChatAiComponent', () => {
  let component: ChatAiComponent;
  let fixture: ComponentFixture<ChatAiComponent>;
  let mockGenAI: MockGoogleGenAI;
  let originalGeminiApi: string;

  beforeAll(() => {
    // Save the original value and set a mock value for all tests in this suite
    originalGeminiApi = environment.GEMINI_API;
    (environment as any).GEMINI_API = 'mock-gemini-api-key';
  });

  afterAll(() => {
    // Restore the original value after all tests have run
    (environment as any).GEMINI_API = originalGeminiApi;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, HttpClientModule, Button, ChatAiComponent],
      providers: [
        { provide: GoogleGenAI, useClass: MockGoogleGenAI }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAiComponent);
    component = fixture.componentInstance;
    mockGenAI = TestBed.inject(GoogleGenAI) as unknown as MockGoogleGenAI; // Cast to access spy

    // Mock window.Audio for playNotificationSound
    spyOn(window, 'Audio').and.returnValue(new MockAudio('') as any);

    spyOn(console, 'error'); // Spy on console.error for error handling tests
    fixture.detectChanges(); // Initial change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleChatWindow', () => {
    it('should set isToggled to true when currently false', () => {
      component.isToggled = false;
      component.toggleChatWindow();
      expect(component.isToggled).toBeTrue();
      expect(component.isClosing).toBeFalse();
    });

    it('should set isClosing to true and then isToggled to false after timeout when currently true', fakeAsync(() => {
      component.isToggled = true;
      component.isClosing = false;
      component.toggleChatWindow();

      expect(component.isClosing).toBeTrue();
      expect(component.isToggled).toBeTrue(); // Still true until timeout

      tick(300); // Simulate passage of 300ms

      expect(component.isToggled).toBeFalse();
      expect(component.isClosing).toBeFalse();
    }));
  });

  describe('sendMessage', () => {
    it('should not send message if userInput is empty or just whitespace', async () => {
      component.userInput = '';
      await component.sendMessage();
      expect(component.messages.length).toBe(0);
      expect(mockGenAI.models.generateContent).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();

      component.userInput = '   ';
      await component.sendMessage();
      expect(component.messages.length).toBe(0);
      expect(mockGenAI.models.generateContent).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });

    it('should add user message, set loading, call AI, add AI response, play sound, and clear input on success', async () => {
      const userMessage = 'Hello AI';
      component.userInput = userMessage;
      component.messages = [];

      await component.sendMessage();

      expect(component.messages.length).toBe(2);
      expect(component.messages[0]).toEqual({ sender: 'user', text: userMessage });
      expect(component.messages[1]).toEqual({ sender: 'ai', text: 'Mock AI response' });
      expect(component.isLoading).toBeFalse();
      expect(component.userInput).toBe('');
      expect(mockGenAI.models.generateContent).toHaveBeenCalledWith({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: userMessage }] }]
      });
      expect(window.Audio).toHaveBeenCalledWith('assets/notification.mp3');
      expect((window.Audio as any).calls.mostRecent().returnValue.play).toHaveBeenCalled();
    });

    it('should handle AI API errors gracefully', async () => {
      const errorMessage = 'API call failed';
      mockGenAI.models.generateContent.and.returnValue(Promise.reject(new Error(errorMessage)));
      const userMessage = 'Error test';
      component.userInput = userMessage;
      component.messages = [];

      await component.sendMessage();

      expect(component.messages.length).toBe(2);
      expect(component.messages[0]).toEqual({ sender: 'user', text: userMessage });
      expect(component.messages[1].sender).toBe('ai');
      expect(component.messages[1].text).toContain('Error: Could not connect to the AI service.');
      expect(component.isLoading).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Gemini API Error:', jasmine.any(Error));
      expect(window.Audio).not.toHaveBeenCalled(); // No sound on error
    });

    it('should handle AI response with no text', async () => {
      mockGenAI.models.generateContent.and.returnValue(Promise.resolve({ text: undefined }));
      const userMessage = 'No text response';
      component.userInput = userMessage;
      component.messages = [];

      await component.sendMessage();

      expect(component.messages.length).toBe(2);
      expect(component.messages[0]).toEqual({ sender: 'user', text: userMessage });
      expect(component.messages[1]).toEqual({ sender: 'ai', text: 'Error: No response text received.' });
      expect(component.isLoading).toBeFalse();
      expect(window.Audio).toHaveBeenCalledWith('assets/notification.mp3');
      expect((window.Audio as any).calls.mostRecent().returnValue.play).toHaveBeenCalled();
    });
  });

  describe('playNotificationSound', () => {
    it('should create an Audio object and call play', () => {
      // This is already implicitly tested in sendMessage, but good to have a direct test
      (component as any).playNotificationSound(); // Access private method for testing
      expect(window.Audio).toHaveBeenCalledWith('assets/notification.mp3');
      expect((window.Audio as any).calls.mostRecent().returnValue.play).toHaveBeenCalled();
    });
  });
});