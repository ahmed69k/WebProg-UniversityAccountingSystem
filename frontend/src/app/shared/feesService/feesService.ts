import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../userService/userService';
import { tap } from 'rxjs';

export interface Fee {
  id:number,
  user_id:number,
  type:string,
  amount:number,
  created_at:string,
  updated_at:string,
  isPaid:boolean
}

@Injectable({
  providedIn: 'root',
})

export class FeesService {

    fees:Fee[] = []
    apiUrl:string = 'http://localhost:8000/api'
    constructor(private http: HttpClient, private auth: UserService){}

    getStudentFees(){
      return this.http.get<{message:string,fees:Fee[]}>(`${this.apiUrl}/fees/user`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(tap({
        next: res=>{
          this.fees = res.fees
          console.log(this.fees)
        }
      }))
    }
    payFees(){
      return this.http.post<{message:string, fees:Fee[]}>(`${this.apiUrl}/fees/pay`,{},{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
  }
      createFee(feeData: { type: string, amount: number, user_id: string, isPaid?: boolean }) {
      return this.http.post<{ message: string, fee: Fee }>(`${this.apiUrl}/fees`, feeData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    }
      getAllFees(){
      return this.http.get<{message:string,fees:Fee[]}>(`${this.apiUrl}/fees/`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(tap({
        next: res=>{
          this.fees = res.fees
          console.log(this.fees)
        }
      }))
    }

}