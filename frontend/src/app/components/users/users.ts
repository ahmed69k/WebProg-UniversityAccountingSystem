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

  users:any;
  constructor(private userService: UserService) {}
  deleteUser(email:string){

  }

}
