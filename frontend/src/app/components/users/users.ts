import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../shared/userService/userService';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';
import { ToastService } from '../../shared/ToastService';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {

  users:User[] | null = null;
  loading: boolean = true;
  constructor(private userService: UserService, private toast:ToastService) {}
  deleteUser(id:number){
    this.userService.deleteUser(id).subscribe({
      next: res=>{
        this.toast.success(res.message);
        this.users = this.users?.filter(u => u.id !== id) ?? null;

      },
      error: err=>{
        this.toast.error(err.message)
      }
    })
  }

  ngOnInit(){
    this.allUsers()
  }

  allUsers() {
  // Use 'getAllUsers' (as defined in your service)
  this.userService.getAllUsers().subscribe({
    next: (res: any) => {
      // Your service returns { message: string, users: User[] }
      this.users = res.users; 
    },
    error: (err) => {
      console.error('Error fetching users', err);
    }
  });
}

}
