import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Home } from './home';
import { UserService, User } from '../../shared/userService/userService';

// Mock Router
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

// Mock UserService
const mockUserService = {
  users: [
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'admin',
      token: 'test-token-123',
      fees: [],
      salary: []
    }
  ],
  findUser: jasmine.createSpy('findUser')
};

describe('HomeComponent', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let router: Router;
  let userService: UserService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CommonModule, Home],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);

    // Clear localStorage and mocks before each test
    localStorage.clear();
    mockRouter.navigate.calls.reset();
    mockUserService.findUser.calls.reset();
  });

  // Test 1: Component Creation
  describe('Component Creation', () => {
    it('should create the home component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize userTypes with correct data', () => {
      expect(component.userTypes).toBeDefined();
      expect(component.userTypes.length).toBe(3);
      expect(component.userTypes[0].role).toBe('Administrator');
      expect(component.userTypes[1].role).toBe('Accounting Personnel');
      expect(component.userTypes[2].role).toBe('Students');
    });
  });

  // Test 2: User Authentication State
  describe('User Authentication', () => {
    it('should initialize with null token when no token in localStorage', () => {
      localStorage.removeItem('token'); // Explicitly remove token
      localStorage.removeItem('user'); // Also remove user
      const testFixture = TestBed.createComponent(Home);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.token).toBeNull();
    });

    it('should initialize with token when token exists in localStorage', () => {
      localStorage.setItem('token', 'test-token');
      const testFixture = TestBed.createComponent(Home);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.token).toBe('test-token');
    });

    it('should find user when token exists', () => {
      localStorage.setItem('token', 'test-token-123');
      const testFixture = TestBed.createComponent(Home);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.user).toEqual(mockUserService.users[0]);
    });
  });

  // Test 3: isLoggedIn() Method
  describe('isLoggedIn() Method', () => {
    it('should return false when no user data or token in localStorage', () => {
      expect(component.isLoggedIn()).toBeFalse();
    });

    it('should return true when user data exists in localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));
      expect(component.isLoggedIn()).toBeTrue();
    });

    it('should return true when token exists in localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(component.isLoggedIn()).toBeTrue();
    });

    it('should return true when both user data and token exist', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));
      localStorage.setItem('token', 'test-token');
      expect(component.isLoggedIn()).toBeTrue();
    });
  });

  // Test 4: Navigation Methods
  describe('Navigation Methods', () => {
    describe('navigateToProfile()', () => {
      it('should navigate to profile when user is logged in', () => {
        spyOn(component, 'isLoggedIn').and.returnValue(true);
        
        component.navigateToProfile();
        
        expect(router.navigate).toHaveBeenCalledWith(['/profile']);
      });

      it('should navigate to login when user is not logged in', () => {
        spyOn(component, 'isLoggedIn').and.returnValue(false);
        
        component.navigateToProfile();
        
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      });
    });

    describe('navigateToLogin()', () => {
      it('should navigate to login page', () => {
        component.navigateToLogin();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      });
    });

    describe('navigateToSignUp()', () => {
      it('should navigate to sign-up page', () => {
        component.navigateToSignUp();
        expect(router.navigate).toHaveBeenCalledWith(['/sign-up']);
      });
    });
  });

  // Test 5: Template Rendering
  describe('Template Rendering', () => {
    it('should display welcome message for non-logged-in users', () => {
      spyOn(component, 'isLoggedIn').and.returnValue(false);
      fixture.detectChanges();
      
      const titleElement = fixture.nativeElement.querySelector('.main-title');
      expect(titleElement.textContent).toContain('Welcome to UAS');
    });

    it('should display welcome back message for logged-in users', () => {
      spyOn(component, 'isLoggedIn').and.returnValue(true);
      component.user = { name: 'John Doe' } as User;
      fixture.detectChanges();
      
      const titleElement = fixture.nativeElement.querySelector('.main-title');
      expect(titleElement.textContent).toContain('Welcome back, John Doe');
    });

    it('should show login and register buttons when not logged in', () => {
      component.token = null;
      fixture.detectChanges();
      
      const buttons = fixture.nativeElement.querySelectorAll('.btn-outline');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toContain('Login');
      expect(buttons[1].textContent).toContain('Register');
    });

    it('should show profile button when logged in', () => {
      component.token = 'test-token';
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('.btn-outline');
      expect(button.textContent).toContain('Profile');
    });

    it('should display user types section when not logged in', () => {
      spyOn(component, 'isLoggedIn').and.returnValue(false);
      fixture.detectChanges();
      
      const userSection = fixture.nativeElement.querySelector('.users-section');
      const userCards = fixture.nativeElement.querySelectorAll('.user-card');
      
      expect(userSection).toBeTruthy();
      expect(userCards.length).toBe(3); // 3 user types
    });

    it('should not display user types grid when logged in', () => {
      // Set up user data first
      component.user = { 
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password', 
        role: 'user',
        fees: [],
        salary: []
      } as User;
      
      spyOn(component, 'isLoggedIn').and.returnValue(true);
      fixture.detectChanges();
      
      const userGrid = fixture.nativeElement.querySelector('.users-grid');
      expect(userGrid).toBeFalsy();
    });
  });

  // Test 6: User Types Data
  describe('User Types Data', () => {
    it('should have correct access permissions for Administrator', () => {
      const admin = component.userTypes[0];
      expect(admin.access).toContain('Full system access');
      expect(admin.access).toContain('User management');
      expect(admin.access).toContain('Financial oversight');
    });

    it('should have correct access permissions for Accounting Personnel', () => {
      const accounting = component.userTypes[1];
      expect(accounting.access).toContain('Payroll management');
      expect(accounting.access).toContain('Budget tracking');
      expect(accounting.access).toContain('Fee collection');
    });

    it('should have correct access permissions for Students', () => {
      const students = component.userTypes[2];
      expect(students.access).toContain('View fee history');
      expect(students.access).toContain('Make payments');
      expect(students.access).toContain('Access invoices');
    });
  });
});