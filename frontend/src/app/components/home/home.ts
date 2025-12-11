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
  user:User | null = null;
  token: any;
    userTypes = [
    {
      role: 'Administrator',
      access: ['Full system access', 'User management', 'Financial oversight']
    },
    {
      role: 'Accounting Personnel',
      access: ['Payroll management', 'Budget tracking', 'Fee collection']
    },
    {
      role: 'Students',
      access: ['View fee history', 'Make payments', 'Access invoices']
    }
  ];
  constructor(private router: Router, private userService:UserService) {}

  get currentUser(){
    return this.userService.user
  }

  isLoggedIn():boolean{
    const token = localStorage.getItem('token');
    return !!token && token.trim() !== '';
  }
  navigateToLogin(){
    this.router.navigate(['/login'])
  }
  navigateToProfile(){
    this.router.navigate(['/profile'])
  }
  navigateToSignUp(){
    this.router.navigate(['/register'])
  }
}