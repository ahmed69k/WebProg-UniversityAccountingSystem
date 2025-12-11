import { User, UserService } from '../../shared/userService/userService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fee, FeesService } from '../../shared/feesService/feesService';
import { ToastService } from '../../shared/ToastService';


@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-fees.html',
  styleUrls: ['./student-fees.css']
})
export class StudentFees {
  student: User | null = null;
  fees: Fee[] | null = null
  loading: boolean = true;
  constructor(private us:UserService, private fs: FeesService, private toast:ToastService){}
   
  get currentUser():User | null{
    return this.us.user
  }
  ngOnInit(){
    this.fs.getStudentFees().subscribe({
      next: res=>{
        this.fees = this.fs.fees
        this.loading = false;
      }
    })
  }
  get totalDue() {
    return(this.fees || [])
      .filter(f => f.isPaid ===false)
      .reduce((sum, fee) => sum + fee.amount, 0);
  }

  makePayment() {
    this.us.getUserCreditCard().subscribe({
      next: async (res) => {
        const last4 = res.slice(-4) ?? "????";

        const confirmed = await this.toast.feePayment(last4);

        if (!confirmed) return;

        this.fs.payFees().subscribe({
          next: (res) => {
            this.toast.success("Fees paid!")
            if (this.fees) {
              this.fees = this.fees.map(f => ({ ...f, isPaid: true }));
            }
          },
          error: err => this.toast.error("Payment failed.")
        });
      },
      error: err => {
        this.toast.error("Could not retrieve credit card.");
        console.error(err);
      }
    });
  }

  }


