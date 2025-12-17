import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import LogRocket from 'logrocket';

export interface Department{
  name: string;
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  id?:number;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  departments: Department[] = []
  apiUrl:string = 'http://localhost:8000/api'

  constructor(private http:HttpClient){}

  addDepartment(department: Department){
    return this.http.post<{message:string, department:Department}>(`${this.apiUrl}/departments`,department,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(tap({
      next: res=>{
        this.departments.push(res.department);
      }
    }))
  }

  findDepartment(name: string): Department | undefined {
    return this.departments.find(d => d.name === name)
  }

  findDepartmentById(id: number): Department | undefined {
    return this.departments.find(d => d.id === id)
  }

  getDepartments(){
    const start = performance.now()
    return this.http.get<{message:string, departments:Department[]}>(`${this.apiUrl}/departments`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).pipe(
      tap({
        next: res=>{
          this.departments = res.departments
          const loadTime = performance.now() - start
          LogRocket.track('Departments Retrieval Time', {page: 'Departments', loadTime: loadTime})
        }
      })
    )
  }

  deleteDepartment(id: number | undefined){
    return this.http.delete<{message:string, deleted_department:Department}>(`${this.apiUrl}/departments/${id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
  }

  // NEW: Update department method
  updateDepartment(updatedDepartment: Department) {
    return this.http.put<{message:string, updated_department:Department}>(`${this.apiUrl}/departments/update/${updatedDepartment.id}`,updatedDepartment,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})
  }
}