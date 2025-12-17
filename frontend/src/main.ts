import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App} from './app/app';
import { routes } from './app/app.routes'; // The array we made above

bootstrapApplication(App, {
  providers: [
    provideRouter(routes), // This is the "Installation" of the Router
    provideHttpClient()
  ]
}).catch(err => console.error(err));