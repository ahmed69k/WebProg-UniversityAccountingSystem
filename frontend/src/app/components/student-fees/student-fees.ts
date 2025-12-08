import { User, UserService } from '../../shared/userService/userService';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fee } from '../../shared/userService/userService';

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-fees.html',
  styleUrls: ['./student-fees.css']
})
export class StudentFees {
  student: User | undefined;
  fees: Fee[] | undefined;
  constructor(private us:UserService){
    this.student = this.us.users.find(u=> u.token === localStorage.getItem('token'))
    this.fees = this.student?.fees;
  }
   



  get totalDue() {
    return(this.fees || [])
      .filter(f => f.isPaid ===false)
      .reduce((sum, fee) => sum + fee.amount, 0);
  }

  makePayment() {
    alert('This is a mock payment screen — no backend connected.');
  }
}

