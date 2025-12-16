import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { ToastService } from '../ToastService';
import LogRocket from 'logrocket';

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
  profile_picture?: string,
  created_at:string,
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
          LogRocket.identify((this.user!.id).toString(), {
          name: this.user!.name,
          email: this.user!.email,
          role: this.user!.role,
        });
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
    return this.http.get<{message:string, user:User}>(`${this.apiUrl}/profile`,{
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    }).pipe(tap({
      next: res=>{
        this.user = res.user;
      }
    }))
  }
  updateUser(userData:any){
    let body: any;
    let headers:any= {Authorization: `Bearer ${localStorage.getItem('token')}`}

    if(userData instanceof FormData) {
      body = userData;
    }
    else{
      body = userData;
      headers['Content-Type'] = 'application/json'
    }
    return this.http.put<{message:string, user:User,affected_fields:{[key:string]:string|number|null}}>(`${this.apiUrl}/user/${this.user?.id}`, body, {headers}
    ).pipe(tap( res=>{
        this.user = res.user
      }
    ))
  }
  getUserCreditCard(){
    return this.http.get<{message:string,credit_card:string}>(`${this.apiUrl}/user/credit`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .pipe( map(res=>res.credit_card))
  }
  getAllUsers(){
    const start = performance.now()
    return this.http.get<{message:string, users:User[]}>(`${this.apiUrl}/users`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(
      tap({
        next: res=>{
          const loadTime = performance.now() - start
          LogRocket.track('Users Table Load Time', {page: "Users", loadTime: loadTime})
        }
      })
    );
  }
  deleteUser(id:number){
    return this.http.delete<{message:string, deleted_user:User}>(`${this.apiUrl}/users/${id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}});
  }


  
}
