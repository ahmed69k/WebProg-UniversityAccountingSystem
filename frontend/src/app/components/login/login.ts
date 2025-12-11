import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Button } from "../../shared/button/button";
import { Router } from '@angular/router';
import { UserService, User } from '../../shared/userService/userService';
import { ToastService } from '../../shared/ToastService';

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

  constructor(private router:Router, private userService: UserService, private toast:ToastService){}

  login(){
    const payload = {
      email:this.email,
      password:this.password
    }
    this.userService.login(payload).subscribe({
      next: res=>{
        this.toast.success(res.message)
        this.router.navigate(['/profile'])
      },
      error: err =>{
        this.toast.error(err.message);
      }
    })
  }
}
