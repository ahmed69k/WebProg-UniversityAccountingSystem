import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-payroll.html',
  styleUrls: ['./staff-payroll.css']
})
export class StaffPayroll {

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

  calculateNet(p: any) {
    return p.baseSalary + p.bonus - p.deductions;
  }
}

