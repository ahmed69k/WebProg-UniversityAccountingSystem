import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Fee {
  type: string;
  amount: number;
  isPaid: boolean;
  studentId: string;
}

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-fees.html',
  styleUrls: ['./student-fees.css']
})
export class StudentFees {

  currentUser: User;
  
  // Mock students
  allStudents: User[] = [
    { id: 'ST1001', name: 'John Doe', email: 'john@example.com', role: 'Student' },
    { id: 'ST1002', name: 'Jane Smith', email: 'jane@example.com', role: 'Student' }
  ];

  // Mock fees
  allFees: Fee[] = [
    { studentId: 'ST1001', type: 'Tuition Fee', amount: 12000, isPaid: true },
    { studentId: 'ST1001', type: 'Library Fee', amount: 400, isPaid: false },
    { studentId: 'ST1001', type: 'Lab Fee', amount: 700, isPaid: true },
    { studentId: 'ST1001', type: 'Technology Fee', amount: 500, isPaid: false },

    { studentId: 'ST1002', type: 'Tuition Fee', amount: 12000, isPaid: true },
    { studentId: 'ST1002', type: 'Library Fee', amount: 400, isPaid: true },
    { studentId: 'ST1002', type: 'Lab Fee', amount: 700, isPaid: false },
    { studentId: 'ST1002', type: 'Technology Fee', amount: 500, isPaid: false }
  ];

  constructor() {
    // Simulate current logged-in user
    const storedRole = localStorage.getItem('role') || 'Student';
    const storedId = localStorage.getItem('userId') || 'ST1001';
    this.currentUser = { id: storedId, name: 'John Doe', email: 'john@example.com', role: storedRole };
  }

  // ----- Helpers -----
  feesForStudent(studentId: string) {
    return this.allFees.filter(f => f.studentId === studentId);
  }

  totalDue(fees: Fee[]) {
    return fees.filter(f => !f.isPaid).reduce((sum, f) => sum + f.amount, 0);
  }

  makePayment() {
    alert('This is a mock payment screen — no backend connected.');
  }

  // Role checks
  get isStudent() { return this.currentUser.role === 'Student'; }
  get isAccounting() { return this.currentUser.role === 'Accounting'; }
  get isDenied() { return this.currentUser.role === 'Admin' || this.currentUser.role === 'Staff'; }
}
