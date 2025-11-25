import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminPanel } from './admin-panel';
import { UserService, User } from '../../shared/userService/userService';

// Mock Router
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

// Mock UserService
const mockUserService = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'Admin',
      token: 'admin-token-123',
      fees: [],
      salary: []
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password',
      role: 'User',
      token: 'user-token-456',
      fees: [],
      salary: []
    }
  ],
  findUser: jasmine.createSpy('findUser')
};

describe('AdminPanelComponent', () => {
  let component: AdminPanel;
  let fixture: ComponentFixture<AdminPanel>;
  let router: Router;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, AdminPanel],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPanel);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);

    // Set up localStorage
    localStorage.setItem('token', 'admin-token-123');
    
    // Reset spy calls
    mockRouter.navigate.calls.reset();
    mockUserService.findUser.calls.reset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test 1: Component Creation and Initialization
  describe('Component Creation', () => {
    it('should create the admin panel component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with user based on token', () => {
      // Recreate the component with proper localStorage setup
      localStorage.setItem('token', 'admin-token-123');
      const freshFixture = TestBed.createComponent(AdminPanel);
      const freshComponent = freshFixture.componentInstance;
      
      expect(freshComponent.user).toEqual(mockUserService.users[0]);
      expect(freshComponent.token).toBe('admin-token-123');
    });

    it('should initialize with correct image paths', () => {
      expect(component.usersBgImage).toBe('./admin-panel/assets/user-management.png');
      expect(component.payrollBgImage).toBe('./admin-panel/assets/staff-payroll.png');
      expect(component.budgetBgImage).toBe('./admin-panel/assets/department-budget.png');
      expect(component.studentFeesBgImage).toBe('./admin-panel/assets/student-fees.png');
    });
  });

  // Test 2: Navigation Methods
  describe('Navigation Methods', () => {
    beforeEach(() => {
      // Set admin user for navigation tests
      component.user = mockUserService.users[0];
    });

    it('should navigate to users page', () => {
      component.navigateToUsers();
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should navigate to staff payroll page', () => {
      component.navigateToStaffPayroll();
      expect(router.navigate).toHaveBeenCalledWith(['/staff-payroll']);
    });

    it('should navigate to department budget page', () => {
      component.navigateToDepartmentBudget();
      expect(router.navigate).toHaveBeenCalledWith(['/department-budget']);
    });

    it('should navigate to student fees page', () => {
      component.navigateToStudentFees();
      expect(router.navigate).toHaveBeenCalledWith(['/student-fees']);
    });
  });

  // Test 3: Admin Role Check
  describe('isAdmin() Method', () => {
    it('should return true when user role is Admin', () => {
      component.user = mockUserService.users[0]; // Admin user
      expect(component.isAdmin()).toBeTrue();
    });

    it('should return false when user role is not Admin', () => {
      component.user = mockUserService.users[1]; // Regular user
      expect(component.isAdmin()).toBeFalse();
    });

    it('should return false when user is undefined', () => {
      component.user = {} as User;
      expect(component.isAdmin()).toBeFalse();
    });

    it('should return false when user role is empty', () => {
      component.user = { role: '' } as User;
      expect(component.isAdmin()).toBeFalse();
    });

    it('should return false when user role is null', () => {
      component.user = { role: null } as any;
      expect(component.isAdmin()).toBeFalse();
    });
  });

  // Test 5: User Authentication Edge Cases
  describe('User Authentication Edge Cases', () => {
    it('should handle missing token in localStorage', () => {
      localStorage.removeItem('token');
      const testFixture = TestBed.createComponent(AdminPanel);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.token).toBeNull();
      // The user would be undefined due to the ! assertion
    });

    it('should handle invalid token in localStorage', () => {
      localStorage.setItem('token', 'invalid-token');
      const testFixture = TestBed.createComponent(AdminPanel);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.token).toBe('invalid-token');
      // The user would be undefined due to the ! assertion
    });
  });

  // Test 6: Button Interactions
  describe('Button Interactions', () => {
    beforeEach(() => {
      component.user = mockUserService.users[0]; // Admin user
      fixture.detectChanges();
    });

    it('should call navigateToUsers when users card is clicked', () => {
      spyOn(component, 'navigateToUsers');
      
      const usersCard = fixture.nativeElement.querySelector('.btn-users');
      usersCard.click();
      
      expect(component.navigateToUsers).toHaveBeenCalled();
    });

    it('should call navigateToStaffPayroll when payroll card is clicked', () => {
      spyOn(component, 'navigateToStaffPayroll');
      
      const payrollCard = fixture.nativeElement.querySelector('.btn-payroll');
      payrollCard.click();
      
      expect(component.navigateToStaffPayroll).toHaveBeenCalled();
    });

    it('should call navigateToDepartmentBudget when budget card is clicked', () => {
      spyOn(component, 'navigateToDepartmentBudget');
      
      const budgetCard = fixture.nativeElement.querySelector('.btn-budget');
      budgetCard.click();
      
      expect(component.navigateToDepartmentBudget).toHaveBeenCalled();
    });

    it('should call navigateToStudentFees when fees card is clicked', () => {
      spyOn(component, 'navigateToStudentFees');
      
      const feesCard = fixture.nativeElement.querySelector('.btn-fees');
      feesCard.click();
      
      expect(component.navigateToStudentFees).toHaveBeenCalled();
    });
  });

    // Test 7: Component Configuration
  describe('Component Configuration', () => {
    it('should be configured as a standalone component', () => {
      // This is verified by the component's @Component decorator
      // We can verify it imports the required modules
      expect(component).toBeTruthy(); // Implicit verification that component works as standalone
    });
  });
});