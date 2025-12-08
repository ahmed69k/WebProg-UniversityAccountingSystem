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
  currentUser: User | undefined;
  showSettings: boolean = false; // Add this property to control visibility

  constructor(private userService: UserService) {
    const token = localStorage.getItem('token')
    if(token){
      this.currentUser = userService.users.find(u=> u.token ===token)
    }
  }

  changePassword(newPassword: string) {
    if (this.currentUser) {
      this.currentUser.password = newPassword;
      this.userService.updateUser(this.currentUser);
      alert('Password changed successfully!');
    }
  }

  changeEmail(newEmail: string) {
    if (this.currentUser) {
      const existingUser = this.userService.findUser(newEmail);
      if (existingUser) {
        alert('Email already in use!');
        return;
      }
      this.currentUser.email = newEmail;
      this.userService.updateUser(this.currentUser);
      alert('Email changed successfully!');
    }
  }

  changeUsername(newName: string) {
    if (this.currentUser) {
      this.currentUser.name = newName;
      this.userService.updateUser(this.currentUser);
      alert('Username changed successfully!');
    }
  }   

  changeProfilePicture(event: any) {
    if (this.currentUser) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.userService.addProfilePicture(this.currentUser!.email, base64String);
        alert('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  }
}