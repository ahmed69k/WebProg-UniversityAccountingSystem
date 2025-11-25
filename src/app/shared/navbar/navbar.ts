import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { UserService } from '../userService/userService';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private userService: UserService){
  }
  get token(){
    return localStorage.getItem('token')
  }
  get user(){
    return this.userService.users.find(u=>u.token === this.token)
  }
  logout(){
    localStorage.removeItem('token');
  }
  isAdmin():boolean{
    if(this.user?.role === 'Admin'){
      return true;
    }
    return false;
  }
  isStaff(): boolean {
    const role = this.user?.role?.toLowerCase();
    const staffRoles = ['staff'];
    return staffRoles.includes(role || '');
  } 
isAccounting(): boolean {
  return this.user?.role === 'Accounting Personnel';
}

  isStudent(): boolean {
    if(this.user?.role === 'Student'){
      return true;
    }
    return false;
  }
  isLoggedIn(): boolean {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return !!(userData || token);
  }
}
