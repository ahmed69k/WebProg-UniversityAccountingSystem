import { TestBed } from '@angular/core/testing';
import { FeesService, Fee } from './feesService';

describe('FeesService', () => {
  let service: FeesService;

  beforeEach(() => {
    localStorage.clear(); // clear storage before each test
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeesService);
  });

  const sampleFee: Fee = {
    studentId: '123',
    studentName: 'John Doe',
    semester: 'Fall 2025',
    tuitionFee: 1500,
    totalAmount: 1500,
    paidAmount: 0,
    dueDate: new Date(),
    status: 'pending', 
    invoiceNumber: 'INV-001'
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a fee record', () => {
    service.addFeesRecord(sampleFee);
    const found = service.findFeesById('123');
    expect(found).toBeTruthy();
    expect(found?.studentName).toBe('John Doe');
  });

  it('should update a fee record', () => {
    service.addFeesRecord(sampleFee);

    // Make sure status is literal type
    const updatedFee: Fee = { 
      ...sampleFee, 
      paidAmount: 1500, 
      status: 'paid' as 'paid', // enforce literal type
      paymentDate: new Date() 
    };
    
    const result = service.updateFeesRecord(updatedFee);

    expect(result).toBeTrue();
    const found = service.findFeesById('123');
    expect(found?.status).toBe('paid');
    expect(found?.paidAmount).toBe(1500);
  });

  it('should return false when updating non-existent record', () => {
    const result = service.updateFeesRecord(sampleFee);
    expect(result).toBeFalse();
  });

  it('should delete a fee record', () => {
    service.addFeesRecord(sampleFee);
    service.deleteFeesRecord('123');
    const found = service.findFeesById('123');
    expect(found).toBeUndefined();
  });

  it('should mark a fee as paid', () => {
    service.addFeesRecord(sampleFee);
    const paymentDate = new Date();
    const result = service.markAsPaid('123', paymentDate);

    expect(result).toBeTrue();
    const found = service.findFeesById('123');
    expect(found?.status).toBe('paid');
    expect(found?.paidAmount).toBe(found?.totalAmount);
    expect(found?.paymentDate).toEqual(paymentDate);
  });

  it('should get payment history for paid fee', () => {
    service.addFeesRecord(sampleFee);
    service.markAsPaid('123', new Date());

    const history = service.getPaymentHistory('123');
    expect(history.length).toBe(1);
    expect(history[0].status).toBe('success');
    expect(history[0].amount).toBe(1500);
  });

 

 

});
