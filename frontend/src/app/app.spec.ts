import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GoogleGenAI } from '@google/genai';
import { App } from './app'; // Ensure this matches your component name (e.g., AppComponent)
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Mock GoogleGenAI to control its behavior for this test
class MockGoogleGenAI {
  models = {
    generateContent: jasmine.createSpy('generateContent').and.returnValue(
      Promise.resolve({ text: 'Mock AI response' })
    )
  };
}

describe('App', () => { // <--- Added this wrapper

  beforeEach(async () => {
    // 1. Manually reset the testing module
    TestBed.resetTestingModule(); 

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule 
      ],
      providers: [
        provideRouter([]),
        { provide: GoogleGenAI, useClass: MockGoogleGenAI }
      ]
    }).compileComponents();
  }); // <--- Fixed: beforeEach ends here

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

}); // <--- Added this to close the describe