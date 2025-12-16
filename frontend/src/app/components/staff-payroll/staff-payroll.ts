import { Salary } from '../../shared/userService/userService';
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
  month:string = '';
  salary:number = 0
  allStaff:any;


  constructor(private userService: UserService) {}

  calculateNet(p: any) {
    return p.baseSalary + p.bonus - p.deductions;
  }
  exportDataToJson(){
    const exportedData = {
    //   id: this.currentUser?.id,
    //   name: this.currentUser?.name,
    //   payroll: this.currentUser?.salary,
    // }
    // const jsonStr = JSON.stringify(exportedData, null, 2);
    // const blob = new Blob([jsonStr], {type: 'application/json'});
    // const link = document.createElement('a')
    // link.href = URL.createObjectURL(blob);
    // link.download = `${this.currentUser?.name}-payroll-data.json`
    // link.click();
    // URL.revokeObjectURL(link.href)
  }
}
  addSalary(){
  }

}

