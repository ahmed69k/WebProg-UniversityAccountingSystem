import { Injectable } from '@angular/core';

export interface Fee {
  studentId: string;
  studentName: string;
  semester: string;
  tuitionFee: number;
  libraryFee?: number;
  labFee?: number;
  otherFees? : number;
  totalAmount: number;
  paidAmount: number;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: Date;
  invoiceNumber: string;
}

export interface PaymentHistory {
  invoiceNumber: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
}

@Injectable({
  providedIn: 'root',
})

export class FeesService {

    feesRecords: Fee[] = []

    constructor(){
      const storedFees = localStorage.getItem('feesRecords')
      if (storedFees) {
        this.feesRecords = JSON.parse(storedFees);
      }
    }
    
    saveFeesRecords() {
      localStorage.setItem('feesRecords', JSON.stringify(this.feesRecords));
    }
    
    addFeesRecord(fees: Fee) {
      this.feesRecords.push(fees);
      this.saveFeesRecords();
    }

    getAllFees(): Fee[] {
      return this.feesRecords;
    }

    findFeesById(studentId: string): Fee | undefined {
      return this.feesRecords.find(f => f.studentId === studentId);
    }

    deleteFeesRecord(studentId: string) {
      const record = this.findFeesById(studentId);
      if (record) {
        this.feesRecords = this.feesRecords.filter(f => f.studentId !== studentId);
        this.saveFeesRecords();
      }
    }

    updateFeesRecord(updatedFees: Fee): boolean {
      const index = this.feesRecords.findIndex(f => f.studentId === updatedFees.studentId); 
        if (index === -1) {
            console.log("Fees record not found for update!");
            return false;
        }
      
        this.feesRecords[index] = updatedFees;
        this.saveFeesRecords();
        return true;
    }

    createInvoice(fees: Fee): string {
      const invoiceNumber = `INV-${Date.now()}`;
      fees.invoiceNumber = invoiceNumber;
      this.addFeesRecord(fees);
      return invoiceNumber;
    }

    markAsPaid(studentId: string, paymentDate: Date): boolean {
      const record = this.findFeesById(studentId);
        if (record) {
            record.status = 'paid';
            record.paidAmount = record.totalAmount;
            record.paymentDate = paymentDate;
            this.saveFeesRecords();
            return true;
        }
        return false;
    }

    getPaymentHistory(studentId: string): PaymentHistory[] {
      const record = this.findFeesById(studentId);
        if (record && record.status === 'paid' && record.paymentDate) {
            return [{
                invoiceNumber: record.invoiceNumber,
                amount: record.paidAmount,
                paymentDate: record.paymentDate,
                paymentMethod: 'Credit Card', 
                transactionId: `TXN-${Date.now()}`, 
                status: 'success'
            }];
        }
        return [];
    }

    getRemainingBalance(studentId: string): number | null {
      const record = this.findFeesById(studentId);
        if (record) {
            return record.totalAmount - record.paidAmount;
        }
        return null;
    }



}