import { Component } from '@angular/core';
import { UserService, User } from '../../shared/userService/userService';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  currentUser: User | undefined;
  constructor(private userService: UserService) {
    const token = localStorage.getItem('token')
    if(token){
      this.currentUser = userService.users.find(u=> u.token ===token)
    }
  }

}
