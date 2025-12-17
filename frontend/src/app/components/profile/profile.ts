import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService, User } from '../../shared/userService/userService';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';
import { ToastService } from '../../shared/ToastService';
import {  OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  // REMOVE 'Button' from this list below
  imports: [CommonModule], 
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  showSettings: boolean = false;
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(private userService: UserService, private toast: ToastService) {
  }
  get currentUser():User | null{
    return this.userService.user
  }
  changeUsername(data:string){
    return this.userService.updateUser({name: data}).subscribe({
      next: res=>{
        this.toast.success("Username updated successfully!");
        console.log(res)
      },
      error: err=>{
        this.toast.error(err.error.message)
        console.log(err)
      }
    })
  }
  changeEmail(data:string){
    return this.userService.updateUser({email: data}).subscribe({
      next: res=>{
        this.toast.success("Email updated successfully!");
        console.log(res)
      },
      error: err=>{
        this.toast.error(err.error.message)
        console.log(err)
      }
    })
  }
  changePassword(data:string){
    return this.userService.updateUser({password: data}).subscribe({
      next: res=>{
        this.toast.success("Password updated successfully!");
        console.log(res)
      },
      error: err=>{
        this.toast.error(err.error.message)
        console.log(err)
      }
    })
  }
  changeProfilePicture(event:any){
    const file = event.target.files[0]
    if(!file) return;
    const formData = new FormData()
    formData.append('profile_picture',file);
    this.userService.updateUser(formData).subscribe({
      next: res=>{
        this.toast.success("Profile picture updated!")
        this.userService.user = res.user
      },
      error: err =>{
        this.toast.error(err.error.message)
        console.log(err)
      }
    })
  }
  triggerFileInput(input: HTMLInputElement) {
    input.click(); // directly trigger the input passed from template
  }


}