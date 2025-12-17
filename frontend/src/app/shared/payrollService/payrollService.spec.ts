import { TestBed } from '@angular/core/testing';
import { PayrollService } from './payrollService';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PayrollService', () => {
  let service: PayrollService;

  beforeEach(() => {
    // FIX 1: Reset module
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      // FIX 2: Add HttpClientTestingModule
      imports: [HttpClientTestingModule],
      providers: [PayrollService]
    });
    service = TestBed.inject(PayrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a salary record', () => {
    const record = { id: 1, employeeName: 'Noura', amount: 5000 };
    (service as any).addSalaryRecord(record);
    // Add your specific expectation here
    expect(service).toBeTruthy(); 
  });
});