import { Component } from '@angular/core';
import { UserService, User } from '../../shared/userService/userService';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  showSettings: boolean = false;
  currentUser:User | null;
  constructor(private userService: UserService) {
    this.currentUser = userService.user;
  }
  changeUsername(data:any){}
  changeEmail(data:any){}
  changePassword(data:any){}
  changeProfilePicture(data:any){}


}