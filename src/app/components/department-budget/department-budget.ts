import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department, DepartmentService} from '../../shared/departmentService/departmentService';
import { User, UserService} from '../../shared/userService/userService';

@Component({
  selector: 'app-department-budget',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './department-budget.html',
  styleUrl: './department-budget.css',
})
export class DepartmentBudget {
  departments: Department[] = [];
  name: string = '';
  totalBudget: number = 0;
  allocatedBudget: number = 0;
  remainingBudget: number = 0;
  user: User;
  token: string | null;

  editingDepartment: Department | null = null;
  showForm: boolean = false;

  constructor( 
    private departmentService: DepartmentService, 
    private userService: UserService
  ){
    this.departments = this.departmentService.getDepartments();
    this.token = localStorage.getItem('token')
    this.user = userService.users.find(u => u.token === this.token)!
  }

  onSubmit(): void {
    if (this.editingDepartment) {
      this.updateDepartment();
    } else {
      this.addDepartment();
    }
  }

  addDepartment(): void {
    const currentDepartment: Department = {
      id: Math.floor(Math.random() * (9999 - 1 + 1)) + 1,
      name: this.name,
      totalBudget: this.totalBudget,
      allocatedBudget: this.allocatedBudget,
      remainingBudget: this.totalBudget - this.allocatedBudget
    };
    
    this.departmentService.addDepartment(currentDepartment);
    this.departments = this.departmentService.getDepartments();
    this.resetForm();
  }

  updateDepartment(): void {
    if (!this.editingDepartment) return;

    const updatedDepartment: Department = {
      id: this.editingDepartment.id,
      name: this.name,
      totalBudget: this.totalBudget,
      allocatedBudget: this.allocatedBudget,
      remainingBudget: this.totalBudget - this.allocatedBudget
    };

    const success = this.departmentService.updateDepartment(updatedDepartment);
    
    if (success) {
      this.departments = this.departmentService.getDepartments();
      this.resetForm();
    } else {
      alert('Failed to update department!');
    }
  }

  startEditDepartment(department: Department): void {
    this.editingDepartment = department;
    this.name = department.name;
    this.totalBudget = department.totalBudget;
    this.allocatedBudget = department.allocatedBudget;
    this.remainingBudget = department.remainingBudget;
    this.showForm = true;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.name = '';
    this.totalBudget = 0;
    this.allocatedBudget = 0;
    this.remainingBudget = 0;
    this.editingDepartment = null;
    this.showForm = false;
  }

  deleteDepartment(name: string): void {
    const confirmed = window.confirm(`Are you sure you want to delete department: ${name}?`);
    
    if (confirmed) {
      this.departmentService.deleteDepartment(name);
      this.departments = this.departmentService.getDepartments();
    }
  }

  quickUpdateBudget(department: Department, field: 'totalBudget' | 'allocatedBudget', value: number): void {
    let remainingBudget: number;
    
    if (field === 'totalBudget') {
      remainingBudget = value - department.allocatedBudget;
    } else {
      remainingBudget = department.totalBudget - value;
    }

    const updatedDepartment = {
      ...department,
      [field]: value,
      remainingBudget: remainingBudget
    };

    this.departmentService.updateDepartment(updatedDepartment);
    this.departments = this.departmentService.getDepartments();
  }

  calculateRemainingBudget(): void {
    this.remainingBudget = this.totalBudget - this.allocatedBudget;
  }

  getTotalBudget(): number {
    return this.departments.reduce((sum, dept) => sum + dept.totalBudget, 0);
  }

  getTotalAllocated(): number {
    return this.departments.reduce((sum, dept) => sum + dept.allocatedBudget, 0);
  }

  getTotalRemaining(): number {
    return this.departments.reduce((sum, dept) => sum + dept.remainingBudget, 0);
  }

  isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

}