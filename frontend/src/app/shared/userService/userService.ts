import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ToastService } from '../ToastService';

export interface Fee{
  type: string,
  amount: number,
  isPaid:boolean,
}

export interface Salary{
  month:string,
  baseSalary: number,
  bonus?:number,
  deductions?: number
}

export interface User{
  name: string,
  email: string,
  role: string,
  id:number;
  profilePicture?: string,
  create_at:string,
  updated_at:string
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User | null = null
  users:any;
  apiUrl:string = 'http://localhost:8000/api'

  constructor(private http: HttpClient, private toast:ToastService){}
  

  register(userData:any){
    return this.http.post<{message:string, user:User}>(`${this.apiUrl}/register`,userData,{withCredentials:true})
  }
  login(userData:any){
    return this.http.post<{message:string,user:User,token:string}>(`${this.apiUrl}/login`,userData,{withCredentials:true}).pipe(
      tap({
        next: res=>{
          this.user = res.user
          localStorage.setItem('token',res.token)
          console.log(this.user)
        }
      })
    )
  }
  logout(){
    return this.http.post<{message:string}>(`${this.apiUrl}/logout`,{}, {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        }).pipe(
      tap({
        next: res=>{
          this.user = null;
          localStorage.removeItem('token')
        }
      })
    )
  }
  getCurrentUser(){
    return this.http.get<{message:string, user:User}>(`${this.apiUrl}/profile`,{withCredentials:true})
  }
  
}
