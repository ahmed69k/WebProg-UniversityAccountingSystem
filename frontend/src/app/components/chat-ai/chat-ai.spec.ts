import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAiComponent } from './chat-ai'; 
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GoogleGenAI } from '@google/genai';
import { of } from 'rxjs';

// Mock for the AI Service
class MockGoogleGenAI {
  getGenerativeModel() {
    return {
      generateContent: () => Promise.resolve({ response: { text: () => 'Mock AI Response' } })
    };
  }
}

describe('ChatAiComponent', () => {
  let component: ChatAiComponent;
  let fixture: ComponentFixture<ChatAiComponent>;

  beforeEach(async () => {
    TestBed.resetTestingModule(); // Clean state

    await TestBed.configureTestingModule({
      imports: [ChatAiComponent, HttpClientTestingModule],
      providers: [
        // This provides the actual class your component is looking for
        { provide: GoogleGenAI, useClass: MockGoogleGenAI }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ChatAiComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default empty message', () => {
    // Safely checking for message property
    const msg = (component as any).message;
    expect(msg === undefined || msg === '').toBeTrue();
  });
});