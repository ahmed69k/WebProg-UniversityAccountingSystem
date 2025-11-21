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
  allStaff: User[] | undefined;

  constructor(private userService: UserService) {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser = userService.users.find(u => u.token === token);
      this.allStaff= this.userService.users.filter(u=>u.role==='Staff')
    }
  }

  calculateNet(p: any) {
    return p.baseSalary + p.bonus - p.deductions;
  }

}
