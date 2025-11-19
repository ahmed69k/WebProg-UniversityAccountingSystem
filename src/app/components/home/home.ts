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

  user:User;
  token:string | null;

  constructor(private router: Router, userService:UserService) {
    this.token = localStorage.getItem('token')
    this.user = userService.users.find(u=>u.token === this.token)!


  }

  isLoggedIn(): boolean {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return !!(userData || token);
  }

  navigateToProfile() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

}