import { Salary } from './../../shared/userService/userService';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../shared/userService/userService';
import { Button } from "../../shared/button/button";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule, Button, FormsModule],
  templateUrl: './staff-payroll.html',
  styleUrls: ['./staff-payroll.css']
})
export class StaffPayroll {
  currentUser!: User | undefined;
  allStaff: User[] | undefined;
  month:string = '';
  salary:number = 0


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
  exportDataToJson(){
    const exportedData = {
      id: this.currentUser?.id,
      name: this.currentUser?.name,
      payroll: this.currentUser?.salary,
    }
    const jsonStr = JSON.stringify(exportedData, null, 2);
    const blob = new Blob([jsonStr], {type: 'application/json'});
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob);
    link.download = `${this.currentUser?.name}-payroll-data.json`
    link.click();
    URL.revokeObjectURL(link.href)
  }
  addSalary(){
    const newSalary: Salary = {
      month: this.month,
      baseSalary: this.salary,
      deductions: 0,
      bonus: 0
    }
    if(this.month === ''){
      alert('Month cannot be empty!')
      return;
    }
    if(this.salary === 0){
      alert('Salary cannot be 0!')
      return;
    }
    const currentStaff = this.userService.users.filter(u=>u.role === 'Staff')
    currentStaff.forEach(staffMember=>{
      staffMember.salary.push(newSalary)
    })
    localStorage.setItem('users', JSON.stringify(this.userService.users))
    this.month = ''
    this.salary = 0
  }

}
