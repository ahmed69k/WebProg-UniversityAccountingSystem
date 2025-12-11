import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../shared/userService/userService';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule]
})
export class Home {
  user:any;
  userTypes:any;
  token:any;
  constructor(private router: Router, userService:UserService) {}
  isLoggedIn(){return false}
  navigateToLogin(){}
  navigateToProfile(){}
  navigateToSignUp(){}
}