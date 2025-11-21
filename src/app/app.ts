import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { Navbar } from './shared/navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChatAiComponent } from './components/chat-ai/chat-ai';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HttpClientModule,ChatAiComponent],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('university-accounting-system');
}
