import { TestBed } from '@angular/core/testing';
import { PayrollService, Salary } from './payrollService';

describe('PayrollService', () => {
  let service: PayrollService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a salary record', () => {
    const salary: Salary = {
      employeeId: '1',
      employeeName: 'Adam',
      date: new Date(),
      basicPay: 5000,
      paymentMethod: 'check',
      status: 'pending'
    };

    service.addSalaryRecord(salary);

    expect(service.getAllSalaries().length).toBe(1);
  });

  it('should find salary by ID', () => {
    service.addSalaryRecord({
      employeeId: '2',
      employeeName: 'Mona',
      date: new Date(),
      basicPay: 6000,
      paymentMethod: 'check',
      status: 'processed'
    });

    const result = service.findSalaryById('2');
    expect(result?.employeeName).toBe('Mona');
  });

  it('should update salary', () => {
    const salary = {
      employeeId: '3',
      employeeName: 'Omar',
      date: new Date(),
      basicPay: 7000,
      paymentMethod: 'check',
      status: 'pending'
    };

    it('should update salary', () => {
        const salary: Salary = {
          employeeId: '3',
          employeeName: 'Omar',
          date: new Date(),
          basicPay: 7000,
          paymentMethod: 'check',
          status: 'pending'
        };
      
        service.addSalaryRecord(salary);
      
        // Make sure updatedSalary includes all required fields
        const updatedSalary: Salary = {
          ...salary,
          bonus: 500,
          deductions: 0, 
          status: 'processed' 
        };
      
        service.updateSalaryRecord(updatedSalary);
      
        const result = service.findSalaryById('3');
        expect(result?.bonus).toBe(500);
      });
    })      
  it('should add bonus', () => {
    service.addSalaryRecord({
      employeeId: '4',
      employeeName: 'Hossam',
      date: new Date(),
      basicPay: 4000,
      paymentMethod: 'check',
      status: 'processed'
    });

    const result = service.addBonus('4', 200);

    expect(result).toBeTrue();
    expect(service.findSalaryById('4')?.bonus).toBe(200);
  });

  it('should deduct amount', () => {
    service.addSalaryRecord({
      employeeId: '5',
      employeeName: 'Samir',
      date: new Date(),
      basicPay: 4500,
      paymentMethod: 'check',
      status: 'processed'
    });

    const result = service.detuctAmount('5', 100);

    expect(result).toBeTrue();
    expect(service.findSalaryById('5')?.deductions).toBe(100);
  });
});
