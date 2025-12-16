import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Button } from "../../shared/button/button";
import { Router } from '@angular/router';
import {Fee, Salary, User, UserService } from '../../shared/userService/userService';
import { ToastService } from '../../shared/ToastService';

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
  creditNumber: string='';


  constructor(private router: Router, private userSevice: UserService, private toast:ToastService){}

  onSubmit():void{
    const payload = {
      name: this.name,
      email: this.email,
      password:this.password,
      role:this.role,
      credit_card:this.creditNumber
    }
    this.userSevice.register(payload).subscribe({
        next: (res)=>{
          this.toast.success(res.message)
          this.router.navigate(['/login'])
        },
        error:(err)=>{
          console.log(err)
          this.toast.error(err.error.message)
        }
    })

  }
}
