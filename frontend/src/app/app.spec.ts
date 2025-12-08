import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GoogleGenAI } from '@google/genai';
import { App } from './app';

// Mock GoogleGenAI to control its behavior for this test
class MockGoogleGenAI {
  models = {
    generateContent: jasmine.createSpy('generateContent').and.returnValue(
      Promise.resolve({ text: 'Mock AI response' })
    )
  };
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: GoogleGenAI, useClass: MockGoogleGenAI } // <-- Add provider here
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});