import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StaffPayroll } from './staff-payroll'; // FIX 1: Ensure this name matches your .ts file
import { PayrollService } from '../../shared/payrollService/payrollService'; 

describe('StaffPayrollComponent', () => {
  let component: StaffPayroll;
  let fixture: ComponentFixture<StaffPayroll>;
  let payrollServiceSpy: jasmine.SpyObj<PayrollService>;

  beforeEach(async () => {
    // FIX 2: Clear previous test state
    TestBed.resetTestingModule();

    payrollServiceSpy = jasmine.createSpyObj('PayrollService', ['getSalaries', 'updateSalary']);

    await TestBed.configureTestingModule({
      // FIX 3: Component goes in imports (if standalone) or declarations
      imports: [StaffPayroll, HttpClientTestingModule], 
      // FIX 4: Service goes in providers, NOT imports
      providers: [
        { provide: PayrollService, useValue: payrollServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffPayroll);
    component = fixture.componentInstance;
    
    // Trigger initial change detection
    fixture.detectChanges();
  });

  it('should create the component successfully', () => {
    expect(component).toBeTruthy();
  });
});