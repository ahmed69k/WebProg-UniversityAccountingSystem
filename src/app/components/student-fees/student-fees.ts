import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-fees.html',
  styleUrls: ['./student-fees.css']
})
export class StudentFees {
  
  student = {
    name: "John Doe",
    id: "ST12345",
  }

  fees = [
    { name: 'Tuition Fee', amount: 12000, status: 'Paid' },
    { name: 'Library Fee', amount: 400, status: 'Unpaid' },
    { name: 'Lab Fee', amount: 700, status: 'Paid' },
    { name: 'Technology Fee', amount: 500, status: 'Unpaid' },
  ];

  get totalDue() {
    return this.fees
      .filter(f => f.status === 'Unpaid')
      .reduce((sum, fee) => sum + fee.amount, 0);
  }

  makePayment() {
    alert('This is a mock payment screen — no backend connected.');
  }
}

