import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminPanel } from './admin-panel';
import { UserService } from '../../shared/userService/userService';
import { By } from '@angular/platform-browser';

describe('AdminPanel', () => {
  let component: AdminPanel;
  let fixture: ComponentFixture<AdminPanel>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    TestBed.resetTestingModule(); // FIX: Reset state
    
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService', [], {
      user: { role: 'Admin' }
    });

    await TestBed.configureTestingModule({
      imports: [AdminPanel],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Role-based Access', () => {
    it('should display the admin panel if the user is an Admin', () => {
      const panel = fixture.debugElement.query(By.css('.admin-panel'));
      expect(panel).not.toBeNull();
    });

    it('should hide the admin panel if the user is NOT an Admin', () => {
      // 1. Force the mock to return 'User'
      Object.defineProperty(userServiceSpy, 'user', { get: () => ({ role: 'User' }) });
      
      // 2. IMPORTANT: Re-run component logic and update HTML
      (component as any).ngOnInit?.(); 
      fixture.detectChanges(); 
      
      const panel = fixture.debugElement.query(By.css('.admin-panel'));
      expect(panel).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should navigate to "/users" when Users Management is clicked', () => {
      const btn = fixture.debugElement.query(By.css('.btn-users'));
      btn.nativeElement.click();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should navigate to "/staff-payroll" when Staff Payroll is clicked', () => {
      const btn = fixture.debugElement.query(By.css('.btn-payroll'));
      btn.nativeElement.click();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/staff-payroll']);
    });

    it('should navigate to "/department-budget" when Department Budget is clicked', () => {
      const btn = fixture.debugElement.query(By.css('.btn-budget'));
      btn.nativeElement.click();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/department-budget']);
    });

    it('should navigate to "/student-fees" when Student Fees is clicked', () => {
      const btn = fixture.debugElement.query(By.css('.btn-fees'));
      btn.nativeElement.click();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/student-fees']);
    });
  });

  describe('Helper Methods', () => {
    it('isAdmin() should return true for Admin role', () => {
      expect(component.isAdmin()).toBeTrue();
    });

    it('isAdmin() should return false for other roles', () => {
      Object.defineProperty(userServiceSpy, 'user', { get: () => ({ role: 'Staff' }) });
      expect(component.isAdmin()).toBeFalse();
    });

    it('should hide the admin panel if the user is NOT an Admin', () => {
      // 1. Set the mock user role
      userServiceSpy.user = { role: 'Student' } as any; 
      
      // 2. IMPORTANT: Update the view to reflect the new user role
      fixture.detectChanges(); 
      
      // 3. Check the DOM
      const adminDiv = fixture.nativeElement.querySelector('.admin-panel');
      expect(adminDiv).toBeNull();
    });
  });
});