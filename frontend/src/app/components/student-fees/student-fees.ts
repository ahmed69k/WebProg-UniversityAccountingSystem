import { User, UserService } from '../../shared/userService/userService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fee, FeesService } from '../../shared/feesService/feesService';
import { ToastService } from '../../shared/ToastService';
import { FormsModule } from '@angular/forms';
import { Button } from "../../shared/button/button";

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './student-fees.html',
  styleUrls: ['./student-fees.css']
})
export class StudentFees implements OnInit {
  student: User | null = null;
  fees: Fee[] | null = null;
  loading: boolean = true;
  user_id:string = ''
  type:string = ''
  amount:number = 0
  isToggled:boolean = false

  // For fee creation

  constructor(private us: UserService, private fs: FeesService, private toast: ToastService) {}

  get currentUser(): User | null {
    return this.us.user;
  }

  ngOnInit() {
    if(this.currentUser?.role==="Accounting Personnel"){
      this.fs.getAllFees().subscribe({
        next:res=>{
          this.fees = res.fees;
          this.loading = false;
        },
        error: err=>{
          console.log(err)
        }
      })
    }
    if(this.currentUser?.role==="Student")
    this.fs.getStudentFees().subscribe({
      next: res => {
        this.fees = this.fs.fees
        this.loading = false;
      }
    });
  }

  get totalDue() {
    return (this.fees || [])
      .filter(f => f.isPaid === false)
      .reduce((sum, fee) => sum + fee.amount, 0);
  }

  makePayment() {
    this.us.getUserCreditCard().subscribe({
      next: async (res) => {
        const last4 = res.slice(-4) ?? "????";
        const confirmed = await this.toast.feePayment(last4);
        if (!confirmed) return;

        this.fs.payFees().subscribe({
          next: () => {
            this.toast.success("Fees paid!")
            if (this.fees) {
              this.fees = this.fees.map(f => ({ ...f, isPaid: true }));
            }
          },
          error: () => this.toast.error("Payment failed.")
        });
      },
      error: () => this.toast.error("Could not retrieve credit card.")
    });
  }

  // <-- New method to add a fee
  addFee() {
    if (!this.type || !this.amount || !this.user_id) {
      this.toast.error("Please fill all required fields.");
      return;
    }
    const newFee = {
      user_id: this.user_id,
      type: this.type,
      amount: this.amount,
      isPaid:false
    }

    this.fs.createFee(newFee).subscribe({
      next: res => {
        this.toast.success(res.message);
        this.fees = this.fees ? [...this.fees, res.fee] : [res.fee];
        this.type= ''
         this.amount= 0,
         this.user_id= ''
         this.isToggled = false;
      },
      error: err => {
        console.error(err);
        this.toast.error(err.error.message);
                this.type= ''
         this.amount= 0,
         this.user_id= ''
         this.isToggled = false;
      }
    });
  }
  toggleWindow(){
    this.isToggled = !this.isToggled
  }
}
