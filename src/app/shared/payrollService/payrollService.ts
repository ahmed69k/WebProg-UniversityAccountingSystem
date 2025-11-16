import { Injectable } from '@angular/core';

export interface Salary {
    employeeId: string;
    employeeName: string;
    date: Date;
    basicPay: number;
    bonus?: number;
    deductions?: number;
    paymentMethod: 'bank transfer' | 'check' ;
    transactionId?: string;
    status: 'processed' | 'pending' | 'failed';
    paymentDate?: Date;
}

@Injectable({
    providedIn: 'root',
})

export class PayrollService {

    salaryRecords: Salary[] = []
    constructor(){
      const storedSalaries = localStorage.getItem('salaryRecords')
      if (storedSalaries) {
        this.salaryRecords = JSON.parse(storedSalaries);
      }
    }  

    saveSalaryRecords() {
      localStorage.setItem('salaryRecords', JSON.stringify(this.salaryRecords));
    }         

    addSalaryRecord(salary: Salary) {
      this.salaryRecords.push(salary);
      this.saveSalaryRecords();
    }

    getAllSalaries(): Salary[] {
      return this.salaryRecords;
    }

    findSalaryById(employeeId: string): Salary | undefined {
      return this.salaryRecords.find(s => s.employeeId === employeeId);
    }

    deleteSalaryRecord(employeeId: string) {
      this.salaryRecords = this.salaryRecords.filter(s => s.employeeId !== employeeId);
      this.saveSalaryRecords();
    }

    updateSalaryRecord(updatedSalary: Salary) {
      const index = this.salaryRecords.findIndex(s => s.employeeId === updatedSalary.employeeId);   
        if (index !== -1) {
          this.salaryRecords[index] = updatedSalary;
          this.saveSalaryRecords();
        }
    }

    addBonus(employeeId: string, bonusAmount: number): boolean {
      const salaryRecord = this.findSalaryById(employeeId);
      if (salaryRecord) {
        salaryRecord.bonus = (salaryRecord.bonus || 0) + bonusAmount;
        this.updateSalaryRecord(salaryRecord);
        return true;
      }
      return false;
    }

    detuctAmount(employeeId: string, deductionAmount: number): boolean {
      const salaryRecord = this.findSalaryById(employeeId);
        if (salaryRecord) {
            salaryRecord.deductions = (salaryRecord.deductions || 0) + deductionAmount;
            this.updateSalaryRecord(salaryRecord);
            return true;
        }
        return false;
    }

}