import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { Navbar } from './shared/navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChatAiComponent } from './components/chat-ai/chat-ai';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from './shared/userService/userService';

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
  this.auth.getCurrentUser().subscribe({
    next: res=>{
      console.log("Profile loaded!", this.auth.user)
    },
    error: err=>{
      this.auth.logout()
    }
  })
  }
}
