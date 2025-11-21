import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../shared/userService/userService';

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-payroll.html',
  styleUrls: ['./staff-payroll.css']
})
export class StaffPayroll {

  currentUser!: User | undefined;

  constructor(private userService: UserService) {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser = userService.users.find(u => u.token === token);
    }
  }

  // The logged-in staff member’s OWN payroll (mock data)
  staff = {
    name: "Malak Ayman",
    id: "EMP99812",
    position: "Senior Accountant"
  };

  payroll = [
    { month: "January", baseSalary: 15000, bonus: 1500, deductions: 500 },
    { month: "February", baseSalary: 15000, bonus: 1200, deductions: 400 },
    { month: "March", baseSalary: 15000, bonus: 2000, deductions: 700 },
  ];

  // Mock ALL payrolls for admin/accounting view
  allPayrolls = [
    {
      staff: { name: "Ali Ahmed", id: "EMP1123", position: "Teacher" },
      payroll: [
        { month: "January", baseSalary: 10000, bonus: 500, deductions: 300 },
        { month: "February", baseSalary: 10000, bonus: 400, deductions: 200 },
      ]
    },
    {
      staff: { name: "Yasmin Khaled", id: "EMP2211", position: "IT Support" },
      payroll: [
        { month: "January", baseSalary: 12000, bonus: 600, deductions: 350 },
      ]
    }
  ];

  calculateNet(p: any) {
    return p.baseSalary + p.bonus - p.deductions;
  }

  get isAdminOrAccounting() {
    return this.currentUser?.role === "Administrator" ||
           this.currentUser?.role === "Accounting Personnel";
  }
}
