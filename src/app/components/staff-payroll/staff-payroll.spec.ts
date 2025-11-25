import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffPayroll } from './staff-payroll';
import { UserService, User, Salary } from '../../shared/userService/userService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';

// Mock UserService for isolated testing
class MockUserService {
  users: User[] = [
    { id: 1, name: 'Admin User', role: 'Admin', token: 'admin-token', salary: [], email: 'admin@test.com', password: 'admin-password', profilePicture: '' ,fees:[]},
    { id: 2, name: 'Staff One', role: 'Staff', token: 'staff-one-token', salary: [], email: 'staff1@test.com', password: 'staff-password', profilePicture: '', fees:[] },
    { id: 3, name: 'Staff Two', role: 'Staff', token: 'staff-two-token', salary: [], email: 'staff2@test.com', password: 'staff-password', profilePicture: '', fees:[] },
    { id: 4, name: 'Student', role: 'Student', token: 'student-token', salary: [], email: 'student@test.com', password: 'student-password', profilePicture: '', fees:[] }
  ];
}

describe('StaffPayroll', () => {
  let component: StaffPayroll;
  let fixture: ComponentFixture<StaffPayroll>;
  let userService: UserService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, Button, StaffPayroll],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();

    // Mock global localStorage
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);

    fixture = TestBed.createComponent(StaffPayroll);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set currentUser and allStaff if token exists', () => {
      localStorageSpy.getItem.and.returnValue('admin-token');
      const newComponent = new StaffPayroll(userService);
      expect(newComponent.currentUser).toBeDefined();
      expect(newComponent.currentUser?.name).toBe('Admin User');
      expect(newComponent.allStaff).toBeDefined();
      expect(newComponent.allStaff?.length).toBe(2);
      expect(newComponent.allStaff?.[0].role).toBe('Staff');
    });

    it('should not set currentUser or allStaff if token does not exist', () => {
      localStorageSpy.getItem.and.returnValue(null);
      const newComponent = new StaffPayroll(userService);
      expect(newComponent.currentUser).toBeUndefined();
      expect(newComponent.allStaff).toBeUndefined();
    });
  });

  describe('calculateNet', () => {
    it('should correctly calculate net salary', () => {
      const payroll = { baseSalary: 3000, bonus: 500, deductions: 200 };
      const net = component.calculateNet(payroll);
      expect(net).toBe(3300); // 3000 + 500 - 200
    });

    it('should handle zero values', () => {
      const payroll = { baseSalary: 3000, bonus: 0, deductions: 0 };
      const net = component.calculateNet(payroll);
      expect(net).toBe(3000);
    });
  });

  describe('exportDataToJson', () => {
    it('should create and click a download link for user payroll data', () => {
      // Arrange
      component.currentUser = userService.users[0]; // Admin User
      const blobSpy = spyOn(window, 'Blob').and.callThrough();
      const urlSpy = spyOn(URL, 'createObjectURL').and.returnValue('fake-url');
      const revokeUrlSpy = spyOn(URL, 'revokeObjectURL');
      const linkSpy = jasmine.createSpyObj<HTMLAnchorElement>('a', ['click']);
      spyOn(document, 'createElement').and.returnValue(linkSpy);

      // Act
      component.exportDataToJson();

      // Assert
      expect(blobSpy).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(linkSpy.href).toBe('fake-url');
      expect(linkSpy.download).toBe('Admin User-payroll-data.json');
      expect(linkSpy.click).toHaveBeenCalled();
      expect(revokeUrlSpy).toHaveBeenCalledWith('fake-url');
    });
  });

  describe('addSalary', () => {
    beforeEach(() => {
      // Set up a logged-in user for the tests
      localStorageSpy.getItem.and.returnValue('admin-token');
      component.currentUser = userService.users.find(u => u.token === 'admin-token');
      component.allStaff = userService.users.filter(u => u.role === 'Staff');
      spyOn(window, 'alert'); // Mock alert to prevent it from popping up during tests
    });

    it('should not add salary if month is empty', () => {
      component.month = '';
      component.salary = 5000;
      component.addSalary();
      expect(window.alert).toHaveBeenCalledWith('Month cannot be empty!');
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should not add salary if salary is 0', () => {
      component.month = 'January';
      component.salary = 0;
      component.addSalary();
      expect(window.alert).toHaveBeenCalledWith('Salary cannot be 0!');
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should add salary to all staff members and save to localStorage', () => {
      // Arrange
      component.month = 'February';
      component.salary = 6000;
      const initialStaffSalaryCount = userService.users.find(u => u.role === 'Staff')?.salary.length || 0;

      // Act
      component.addSalary();

      // Assert
      const staffMembers = userService.users.filter(u => u.role === 'Staff');
      staffMembers.forEach(staff => {
        expect(staff.salary.length).toBe(initialStaffSalaryCount + 1);
        const newSalary = staff.salary[staff.salary.length - 1];
        expect(newSalary.month).toBe('February');
        expect(newSalary.baseSalary).toBe(6000);
      });

      expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify(userService.users));
    });

    it('should reset month and salary fields after successful addition', () => {
      component.month = 'March';
      component.salary = 7000;
      component.addSalary();
      expect(component.month).toBe('');
      expect(component.salary).toBe(0);
    });
  });
});