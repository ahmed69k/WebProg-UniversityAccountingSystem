import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { UserService } from '../userService/userService';
import { ToastService } from '../ToastService';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private userService: UserService, private toast:ToastService, private router:Router){
  }
  logout(){
    return this.userService.logout().subscribe({
      next: res=>{
        this.toast.success(res.message)
        this.router.navigate(['/login'])
      },
      error: err=>{
        this.toast.error(err.message)
      }
    })
  }
  isAdmin(){
    return this.userService.user?.role === "Admin";
  }
  isStaff() {
    return this.userService.user?.role === "Staff";
  } 
isAccounting() {
  return this.userService.user?.role === "Accounting Personnel";
}

  isStudent() {
    return this.userService.user?.role === "Student";
  }
  isLoggedIn():boolean{
  const token = localStorage.getItem('token');
  return !!token && token.trim() !== '';
  }
}
