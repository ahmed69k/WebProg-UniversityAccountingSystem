// src/app/app.config.ts (or wherever your appConfig lives)

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

import { GoogleGenAI } from '@google/genai'; // Correct import for the current SDK

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // Provide the GoogleGenAI instance
    {
      provide: GoogleGenAI,
      useFactory: () => {
        if (!environment.GEMINI_API) {
          console.error('GEMINI_API key is missing in environment!');
        }
        return new GoogleGenAI({ apiKey: environment.GEMINI_API ?? '' });
      },
    },
  ],
};