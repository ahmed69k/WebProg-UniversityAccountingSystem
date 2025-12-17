import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { Navbar } from './shared/navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChatAiComponent } from './components/chat-ai/chat-ai';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from './shared/userService/userService';
import LogRocket from 'logrocket'



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HttpClientModule,ChatAiComponent, FormsModule, CommonModule],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('university-accounting-system');
  constructor(private auth: UserService){}
  ngOnInit(){
    LogRocket.init('9xmazy/testest');
    const start = performance.now()
  this.auth.getCurrentUser().subscribe({
    next: res=>{
      console.log("Profile loaded!", this.auth.user)
      const loadTime = performance.now() - start;
      LogRocket.track('User Loading Time', {page:'Home', loadTime: loadTime })
      LogRocket.identify((this.auth.user!.id).toString(), {
          name: this.auth.user!.name,
          email: this.auth.user!.email,
          role: this.auth.user!.role,
        });
    },
    error: err=>{
      this.auth.logout()
    }
  })
  }
}
