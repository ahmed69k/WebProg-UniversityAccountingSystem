import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-admin-panel',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  @Input() isAdmin: boolean = false;

  constructor(private router: Router) {}

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
}