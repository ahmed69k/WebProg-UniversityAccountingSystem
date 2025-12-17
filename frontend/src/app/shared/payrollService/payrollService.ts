import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import LogRocket from 'logrocket';
import { User } from '../userService/userService';
import { Observable } from 'rxjs';

export interface Salary {
  id:string,
  month:string,
  base_salary:number,
  bonus: number,
  deductions:number,
  user_id:string,
  created_at:string,
  updated_at:string,
  user?:{
    id:string,
    name:string,
    email:string
  }
}

@Injectable({
    providedIn: 'root',
})

export class PayrollService {
  salaries: Salary[] = []
  apiUrl:string = 'http://localhost:8000/api/salary'
  constructor(private http:HttpClient){}
  getAllSalaries(){
    const start = performance.now()
    return this.http.get<{message:string, salaries:Salary[]}>(`${this.apiUrl}/all`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(tap({
      next: res=>{
        this.salaries = res.salaries;
        const loadTime = performance.now()-start;
        LogRocket.track('Salaries Load Time', {page: "Payroll", loadTime:loadTime})
      }
    }))
  }
  addSalaryRecord(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getSalaryRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserSalaries(){
    const start = performance.now()
    return this.http.get<{message:string, salary:Salary[]}>(`${this.apiUrl}/`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(tap({
      next: res=>{
        this.salaries = res.salary
        const loadTime = performance.now() - start;
        LogRocket.track('Salaries Load Time (E)',{page: "Payroll", loadTime:loadTime})
      }
    }))
  }
  addSalaryForStaff(salary:{month:string,base_salary:number}){
    return this.http.post<{message:string, staff:User[], salary:Salary}>(`${this.apiUrl}/to-all-staff`,salary,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(tap({
      next: res=>{
        this.salaries.push(res.salary)
      }
    }))
  }
  addBonusOrDeductions(id:string,payload:{bonus?:number, deductions?:number}){
    return this.http.put<{message:string,salary:Salary }>(`${this.apiUrl}/bonus-or-deductions/${id}`,payload,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
  }
}