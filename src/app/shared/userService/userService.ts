import { Injectable } from '@angular/core';

export interface Fee{
  type: string,
  amount: number,
  isPaid:boolean,
}
export interface User{
  name: string,
  email: string,
  password: string,
  role: string,
  token?: string,
  id?:number;
  fees: Fee[]
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = []

  constructor(){
    const storedUsers = localStorage.getItem('users')
    if(storedUsers){
      this.users = JSON.parse(storedUsers)
    }
  }
  addUser(user: User){
    this.users.push(user)
    localStorage.setItem('users', JSON.stringify(this.users))
  }
  findUser(email:string) :User | undefined{
    return this.users.find(u => u.email === email)
  }

  updateToken(email:string, token: string){
    const user = this.findUser(email)
    if(user){
      user.token = token;
      localStorage.setItem('users',JSON.stringify(this.users))
    }
  }
  getUsers(): User[]{
    return this.users;
  }
  deleteUser(email: string){
    const user = this.findUser(email)
    const token = localStorage.getItem('token')
    if(!user){
      console.log("User not found!")
      return;
    }
    if(user?.token === token){
      localStorage.removeItem('token')
    }
    this.users = this.users.filter(u => u.email !== email)
    localStorage.setItem('users',JSON.stringify(this.users))
    console.log("User Deleted!")
  }
  
}
