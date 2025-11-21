import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Button } from "../../shared/button/button";
import { Router } from '@angular/router';
import {Fee, User, UserService } from '../../shared/userService/userService';

@Component({
  selector: 'app-sign-up',
  imports: [Button,FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  fees: Fee[] = [];


  constructor(private router: Router, private userSevice: UserService){}
  onSubmit():void{
    if(this.role ==='Student'){
          const currentUser = {
      id: Math.floor(Math.random() * (13009999-13000001+1)) + 13000001,
      name:this.name,
      password: this.password,
      email: this.email,
      role: this.role,
      fees: []
    }
    this.userSevice.addUser(currentUser)
    }
    else{
    const currentUser = {
      name:this.name,
      password: this.password,
      email: this.email,
      role: this.role,
      fees: []
    }
    this.userSevice.addUser(currentUser)
  }


    this.router.navigate(['login'])
  }
}
