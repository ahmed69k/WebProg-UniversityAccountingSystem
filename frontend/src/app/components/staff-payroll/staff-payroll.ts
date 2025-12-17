import { Salary } from '../../shared/payrollService/payrollService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../shared/userService/userService';
import { Button } from "../../shared/button/button";
import { FormsModule } from "@angular/forms";
import { PayrollService } from '../../shared/payrollService/payrollService';
import { ToastService } from '../../shared/ToastService';

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule, Button, FormsModule],
  templateUrl: './staff-payroll.html',
  styleUrls: ['./staff-payroll.css']
})
export class StaffPayroll implements OnInit {
  month: string = '';
  salary: number = 0;
  salaries: Salary[] = [];
  loading: boolean = true;
  months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  isVisible: boolean = false;
  salariesByUser: { user: any; salaries: Salary[] }[] = [];

  constructor(
    private userService: UserService,
    private salaryService: PayrollService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchSalaries();
  }

  /** -------------------- Utility Methods -------------------- **/

  calculateNet(p: Salary) {
    const bonus = p.bonus || 0;
    const deductions = p.deductions || 0;
    return p.base_salary + bonus - deductions;
  }

  exportDataToJson() {
    const exportedData = {
      id: this.userService.user?.id,
      name: this.userService.user?.name,
      payroll: this.salaries,
    };
    const jsonStr = JSON.stringify(exportedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.userService.user?.name}-payroll-data.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  toggleWindow() {
    this.isVisible = !this.isVisible;
  }

  trackBySalary(index: number, salary: Salary) {
    return salary.user_id + salary.month; // unique per salary row
  }

  /** -------------------- Admin & Staff Helpers -------------------- **/

  get isAdmin() {
    return this.userService.user?.role === "Admin";
  }

  get isStaff() {
    return this.userService.user?.role === "Staff";
  }

  get user() {
    return this.userService.user;
  }

  private buildSalariesByUser() {
    const grouped: { [key: string]: { user: any; salaries: Salary[] } } = {};

    this.salaries.forEach(s => {
      if (!s.user) return;

      s.bonus ??= 0;
      s.deductions ??= 0;

      if (!grouped[s.user.id]) {
        grouped[s.user.id] = { user: s.user, salaries: [] };
      }

      grouped[s.user.id].salaries.push(s);
    });

    this.salariesByUser = Object.values(grouped);
  }

  /** -------------------- API Methods -------------------- **/

  fetchSalaries() {
    this.loading = true;

    if (this.user?.role === "Admin") {
      this.salaryService.getAllSalaries().subscribe({
        next: res => {
          this.salaries = res.salaries || [];
          this.buildSalariesByUser()
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.toast.error("Failed to load salaries");
          this.loading = false;
        }
      });
    } else if (this.user?.role === "Staff") {
      this.salaryService.getUserSalaries().subscribe({
        next: res => {
          this.salaries = res.salary || [];
          this.buildSalariesByUser()
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.toast.error("Failed to load salaries");
          this.loading = false;
        }
      });
    }
  }

  addSalary() {
    if (!this.month || !this.salary) return;

    const payload = {
      month: this.month,
      base_salary: this.salary
    };

    this.salaryService.addSalaryForStaff(payload).subscribe({
      next: res => {
        this.fetchSalaries();
        this.toast.success(res.message);
      },
      error: err => {
        console.error(err);
        this.toast.error(err.error.message || "Failed to add salary");
      }
    });
  }

  addBonusOrDeductions(userId: string, salary: Salary) {
    const payload = {
      bonus: salary.bonus || 0,
      deductions: salary.deductions || 0,
      month: salary.month
    };

    this.salaryService.addBonusOrDeductions(userId, payload).subscribe({
      next: res => {
        this.toast.success(res.message);
        this.fetchSalaries(); 
      },
      error: err => {
        this.toast.error(err.error.message || "Failed to update salary");
      }
    });
  }
}
