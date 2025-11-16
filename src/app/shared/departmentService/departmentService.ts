import { Injectable } from '@angular/core';

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

  constructor(){
    const storedDepartments = localStorage.getItem('departments')
    if(storedDepartments){
      this.departments = JSON.parse(storedDepartments)
    }
  }
  addDepartment(department: Department){
    this.departments.push(department)
    localStorage.setItem('departments', JSON.stringify(this.departments))
  }
  findDepartment(name:string) :Department | undefined{
    return this.departments.find(d => d.name === name)
  }

  getDepartments(): Department[]{
    return this.departments;
  }
  deleteDepartment(name: string){
    const department = this.findDepartment(name)
    if(!department){
      console.log("Department not found!")
      return;
    }
    this.departments = this.departments.filter(d => d.name !== name)
    localStorage.setItem('departments',JSON.stringify(this.departments))
    console.log("Department Deleted!")
  }
  
}
