import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { UserService, User } from '../../shared/userService/userService';

@Component({
  selector: 'app-admin-panel',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  
  constructor(private router: Router, private userService:UserService) {
  }

  usersBgImage = './admin-panel/assets/user-management.png';
payrollBgImage = './admin-panel/assets/staff-payroll.png';
budgetBgImage = './admin-panel/assets/department-budget.png';
studentFeesBgImage = './admin-panel/assets/student-fees.png';

  navigateToUsers() {
    this.router.navigate(['/users']);
  }

  navigateToStaffPayroll() {
    this.router.navigate(['/staff-payroll']);
  }

  navigateToDepartmentBudget() {
    this.router.navigate(['/department-budget']);
  }

  navigateToStudentFees() {
    this.router.navigate(['/student-fees']);
  }

  get currentUser(){
    return this.userService.user
  }
  isAdmin():boolean{
    return this.currentUser?.role === "Admin"
    }

}