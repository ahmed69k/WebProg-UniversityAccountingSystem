import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Add this import
import { Department, DepartmentService} from '../../shared/departmentService/departmentService';
import { User, UserService} from '../../shared/userService/userService';
@Component({
  selector: 'app-department-budget',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './department-budget.html',
  styleUrl: './department-budget.css',
})
export class DepartmentBudget {

  departments: Department[] = [
    { name: 'Computer Science', totalBudget: 500000,allocatedBudget:200000,remainingBudget:300000 },
    { name: 'Mathematics', totalBudget: 300000, allocatedBudget:100000,remainingBudget:200000 },
    { name: 'Physics', totalBudget: 400000, allocatedBudget:150000, remainingBudget:250000 }
  ];

  name: string = '';
  totalBudget: number = 0;
  allocatedBudget: number = 0;
  remainingBudget: number = 0;

  user: User;
  token:string | null;

  constructor(private router: Router, private departmentService: DepartmentService, private userService: UserService){
    this.departments = this.departmentService.getDepartments();
    this.token = localStorage.getItem('token')
    this.user = userService.users.find(u=>u.token === this.token)!

  }
    onSubmit():void{
        const currentDepartment = {
          id: Math.floor(Math.random() * (9999-1+1)) + 1,
          name:this.name,
          totalBudget: this.totalBudget,
          allocatedBudget: this.allocatedBudget,
          remainingBudget: this.remainingBudget
      }
      this.departmentService.addDepartment(currentDepartment)

  }

  deleteDepartment(name:string){
    const confirmed = window.confirm(`Are you sure you want to delete department with name ${name}`)
    
    if(confirmed){
    this.departmentService.deleteDepartment(name);
    this.departments = this.departmentService.departments;
    }
  }

  showForm: boolean = false;

  getTotalBudget(): number {
    return this.departments.reduce((sum, dept) => sum + dept.totalBudget, 0);
  }

  getTotalAllocated(): number {
    return this.departments.reduce((sum, dept) => sum + dept.allocatedBudget, 0);
  }

  getTotalRemaining(): number {
    return this.departments.reduce((sum, dept) => sum + dept.remainingBudget, 0);
  }

  isAdmin():boolean{
    if(this.user?.role === 'Admin'){
      return true;
    }
    return false;
  }

}
