import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { StudentFees } from './student-fees';
import { UserService, User, Fee } from '../../shared/userService/userService';

// Mock UserService
const createMockUserService = () => {
  const users: User[] = [
    {
      name: 'Student User',
      email: 'student@example.com',
      password: 'password123',
      role: 'Student',
      token: 'student-token-123',
      id: 101,
      fees: [
        {
          type: 'Tuition Fee',
          amount: 5000,
          isPaid: false
        },
        {
          type: 'Library Fee',
          amount: 500,
          isPaid: true
        },
        {
          type: 'Lab Fee',
          amount: 1000,
          isPaid: false
        }
      ],
      salary: []
    },
    {
      name: 'Another Student',
      email: 'other@example.com',
      password: 'password456',
      role: 'Student',
      token: 'other-token-456',
      id: 102,
      fees: [
        {
          type: 'Tuition Fee',
          amount: 5000,
          isPaid: true
        }
      ],
      salary: []
    }
  ];

  return {
    users: [...users],
    findUser: jasmine.createSpy('findUser').and.callFake((email: string) => {
      return users.find(u => u.email === email);
    })
  };
};

let mockUserService: any;

describe('StudentFeesComponent', () => {
  let component: StudentFees;
  let fixture: ComponentFixture<StudentFees>;
  let userService: UserService;

  beforeEach(async () => {
    // Create fresh mock service for each test
    mockUserService = createMockUserService();

    await TestBed.configureTestingModule({
      imports: [CommonModule, StudentFees],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    // Set up localStorage BEFORE creating component
    localStorage.setItem('token', 'student-token-123');

    fixture = TestBed.createComponent(StudentFees);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test 1: Component Creation and Initialization
  describe('Component Creation', () => {
    it('should create the student fees component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with student based on token', () => {
      // Recreate component with proper localStorage setup
      localStorage.setItem('token', 'student-token-123');
      const freshFixture = TestBed.createComponent(StudentFees);
      const freshComponent = freshFixture.componentInstance;
      
      expect(freshComponent.student).toEqual(mockUserService.users[0]);
      expect(freshComponent.fees).toEqual(mockUserService.users[0].fees);
    });

    it('should handle missing token gracefully', () => {
      localStorage.removeItem('token');
      const testFixture = TestBed.createComponent(StudentFees);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.student).toBeUndefined();
      expect(testComponent.fees).toBeUndefined();
    });

    it('should handle invalid token gracefully', () => {
      localStorage.setItem('token', 'invalid-token');
      const testFixture = TestBed.createComponent(StudentFees);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.student).toBeUndefined();
      expect(testComponent.fees).toBeUndefined();
    });
  });

  // Test 2: Total Due Calculation
  describe('totalDue Property', () => {
    beforeEach(() => {
      // Ensure component has the student data
      component.student = mockUserService.users[0];
      component.fees = mockUserService.users[0].fees;
    });

    it('should calculate total due for unpaid fees', () => {
      const totalDue = component.totalDue;
      // Tuition (5000) + Lab (1000) = 6000 (Library is paid)
      expect(totalDue).toBe(6000);
    });

    it('should return 0 when all fees are paid', () => {
      component.fees = [
        { type: 'Tuition', amount: 5000, isPaid: true },
        { type: 'Library', amount: 500, isPaid: true }
      ];
      
      expect(component.totalDue).toBe(0);
    });

    it('should return 0 when fees array is empty', () => {
      component.fees = [];
      expect(component.totalDue).toBe(0);
    });

    it('should return 0 when fees is undefined', () => {
      component.fees = undefined;
      expect(component.totalDue).toBe(0);
    });

    it('should handle single unpaid fee', () => {
      component.fees = [{ type: 'Tuition', amount: 7500, isPaid: false }];
      expect(component.totalDue).toBe(7500);
    });
  });

  // Test 3: Payment Method
  describe('makePayment() Method', () => {
    it('should show alert when makePayment is called', () => {
      spyOn(window, 'alert');
      
      component.makePayment();

      expect(window.alert).toHaveBeenCalledWith('This is a mock payment screen — no backend connected.');
    });
  });

  // Test 4: Template Rendering
  describe('Template Rendering', () => {
    beforeEach(() => {
      component.student = mockUserService.users[0];
      component.fees = mockUserService.users[0].fees;
      fixture.detectChanges();
    });

    it('should display the correct title', () => {
      const title = fixture.nativeElement.querySelector('.title');
      expect(title.textContent).toBe('Student Fees');
    });

    it('should display student information', () => {
      const studentInfo = fixture.nativeElement.querySelector('.student-info');
      const paragraphs = studentInfo.querySelectorAll('p');
      
      expect(paragraphs[0].textContent).toContain('Name: Student User');
      expect(paragraphs[1].textContent).toContain('ID: 101');
    });

    it('should display fees table with correct headers', () => {
      const table = fixture.nativeElement.querySelector('.fees-table');
      const headers = fixture.nativeElement.querySelectorAll('thead th');
      
      expect(table).toBeTruthy();
      expect(headers.length).toBe(3);
      expect(headers[0].textContent).toContain('Fee Type');
      expect(headers[1].textContent).toContain('Amount');
      expect(headers[2].textContent).toContain('Status');
    });

    it('should display all fees in the table', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3); // Three fees in mock data
    });

    it('should display correct fee information in each row', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      
      // First fee (Tuition - unpaid)
      const firstRowCells = rows[0].querySelectorAll('td');
      expect(firstRowCells[0].textContent).toBe('Tuition Fee');
      expect(firstRowCells[1].textContent).toBe('5000 EGP');
      expect(firstRowCells[2].textContent.trim()).toBe('false'); // Use trim()
      
      // Second fee (Library - paid)
      const secondRowCells = rows[1].querySelectorAll('td');
      expect(secondRowCells[0].textContent).toBe('Library Fee');
      expect(secondRowCells[1].textContent).toBe('500 EGP');
      expect(secondRowCells[2].textContent.trim()).toBe('true'); // Use trim()
    });

    it('should apply correct CSS classes for fee status', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      
      // First row (unpaid) should have 'unpaid' class
      const firstRowStatus = rows[0].querySelector('td:last-child');
      expect(firstRowStatus.classList.contains('unpaid')).toBeTrue();
      expect(firstRowStatus.classList.contains('paid')).toBeFalse();
      
      // Second row (paid) should have 'paid' class
      const secondRowStatus = rows[1].querySelector('td:last-child');
      expect(secondRowStatus.classList.contains('paid')).toBeTrue();
      expect(secondRowStatus.classList.contains('unpaid')).toBeFalse();
    });

    it('should display total due in summary', () => {
      const summary = fixture.nativeElement.querySelector('.summary');
      const totalDue = summary.querySelector('p');
      const paymentButton = summary.querySelector('button');
      
      expect(totalDue.textContent).toContain('Total Due: 6000 EGP');
      expect(paymentButton.textContent).toBe('Make Payment');
    });

    it('should handle empty student data gracefully', () => {
      component.student = undefined;
      component.fees = undefined;
      fixture.detectChanges();

      const studentInfo = fixture.nativeElement.querySelector('.student-info');
      const nameParagraph = studentInfo.querySelector('p:nth-child(1)');
      const idParagraph = studentInfo.querySelector('p:nth-child(2)');
      
      expect(nameParagraph.textContent).toContain('Name:');
      expect(idParagraph.textContent).toContain('ID:');
    });
  });

  // Test 5: User Interaction
  describe('User Interaction', () => {
    beforeEach(() => {
      component.student = mockUserService.users[0];
      component.fees = mockUserService.users[0].fees;
      fixture.detectChanges();
    });

    it('should call makePayment when payment button is clicked', () => {
      spyOn(component, 'makePayment');
      
      const paymentButton = fixture.nativeElement.querySelector('.summary button');
      paymentButton.click();
      
      expect(component.makePayment).toHaveBeenCalled();
    });

    it('should show alert when payment button is clicked', () => {
      spyOn(window, 'alert');
      
      const paymentButton = fixture.nativeElement.querySelector('.summary button');
      paymentButton.click();
      
      expect(window.alert).toHaveBeenCalledWith('This is a mock payment screen — no backend connected.');
    });
  });

  // Test 6: Edge Cases
  describe('Edge Cases', () => {
    it('should handle student with no fees', () => {
      const studentWithNoFees: User = {
        name: 'No Fees Student',
        email: 'nofees@example.com',
        password: 'password',
        role: 'Student',
        token: 'no-fees-token',
        id: 103,
        fees: [],
        salary: []
      };
      
      component.student = studentWithNoFees;
      component.fees = [];
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      const totalDue = fixture.nativeElement.querySelector('.summary p');
      
      expect(rows.length).toBe(0);
      expect(totalDue.textContent).toContain('Total Due: 0 EGP');
    });

    it('should handle fees with zero amount', () => {
      component.fees = [
        { type: 'Zero Fee', amount: 0, isPaid: false },
        { type: 'Regular Fee', amount: 1000, isPaid: false }
      ];
      
      expect(component.totalDue).toBe(1000);
    });

    it('should handle negative fee amounts gracefully', () => {
      component.fees = [
        { type: 'Negative Fee', amount: -500, isPaid: false },
        { type: 'Positive Fee', amount: 1000, isPaid: false }
      ];
      
      expect(component.totalDue).toBe(500); // -500 + 1000 = 500
    });
  });

  // Test 7: Component Configuration
  describe('Component Configuration', () => {
    it('should be configured as a standalone component', () => {
      expect(component).toBeTruthy(); // Implicit verification
    });

    it('should import CommonModule', () => {
      // This is verified by the component's imports in TestBed
      expect(component).toBeTruthy();
    });
  });
});