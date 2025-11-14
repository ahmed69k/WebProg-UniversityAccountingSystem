import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Button } from "../../shared/button/button";
import { Router } from '@angular/router';
import { UserService, User } from '../../shared/userService/userService';

@Component({
  selector: 'app-login',
  imports: [Button, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string ='';
  role: string = '';

  constructor(private router:Router, private userService: UserService){}
  login(){
    const currentUser = this.userService.findUser(this.email); 
    if(!currentUser) console.log('User not found!')
    
    if(currentUser?.password !== this.password){
      alert("Incorrect Password!")
      return;
    }
    const token = btoa(`${this.email}:${new Date().getTime()}`)
    this.userService.updateToken(this.email, token)
    localStorage.setItem('token', token)
    this.router.navigate(['profile'])
  }
}
