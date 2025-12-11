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

  user:User;
  token:string | null;
  
  constructor(private router: Router, userService:UserService) {
    this.token = localStorage.getItem('token')
    this.user = userService.users.find()!
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

  isAdmin():boolean{
      if(this.user?.role === 'Admin'){
        return true;
      }
      return false;
    }

}