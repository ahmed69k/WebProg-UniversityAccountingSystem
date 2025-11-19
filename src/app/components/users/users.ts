import { Component } from '@angular/core';
import { UserService, User } from '../../shared/userService/userService';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-users',
  imports: [CommonModule, Button],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users: User[];
  constructor(private userService: UserService) {
    this.users = userService.users;
  }
  deleteUser(email:string){
    const user = this.userService.findUser(email);
    if(!user) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete user ${user.name}`)
    if(confirmed){
    this.userService.deleteUser(email);
    this.users = this.userService.users;
    }
  }

}
