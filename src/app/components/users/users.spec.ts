import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Users } from './users';
import { UserService, User } from '../../shared/userService/userService';
import { Button } from '../../shared/button/button';

// Mock UserService with fresh data for each test
const createMockUserService = () => {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
      token: 'admin-token-123',
      id: 1,
      fees: [],
      salary: []
    },
    {
      name: 'Student User',
      email: 'student@example.com',
      password: 'password456',
      role: 'Student',
      token: 'student-token-456',
      id: 2,
      fees: [],
      salary: []
    },
    {
      name: 'Accounting User',
      email: 'accounting@example.com',
      password: 'password789',
      role: 'Accounting',
      token: 'accounting-token-789',
      id: 3,
      fees: [],
      salary: []
    }
  ];

  return {
    users: [...users], // Create a copy
    findUser: jasmine.createSpy('findUser').and.callFake((email: string) => {
      return users.find(u => u.email === email);
    }),
    deleteUser: jasmine.createSpy('deleteUser'),
    getUsers: jasmine.createSpy('getUsers').and.callFake(() => {
      return [...users]; // Return a copy
    })
  };
};

let mockUserService: any;

describe('UsersComponent', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;
  let userService: UserService;

  beforeEach(async () => {
    // Create fresh mock service for each test
    mockUserService = createMockUserService();

    await TestBed.configureTestingModule({
      imports: [CommonModule, Users, Button],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Users);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  // Test 1: Component Creation and Initialization
  describe('Component Creation', () => {
    it('should create the users component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with users from service', () => {
      expect(component.users).toEqual(mockUserService.users);
      expect(component.users.length).toBe(3);
    });

    it('should call userService to get users', () => {
      // The service is called in the constructor
      expect(userService.users).toBe(mockUserService.users);
    });
  });

 // Test 2: Delete User Functionality
  describe('deleteUser() Method', () => {
    it('should delete user when confirmation is accepted', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteUser('student@example.com');

      expect(userService.deleteUser).toHaveBeenCalledWith('student@example.com');
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete user Student User');
    });

    it('should not delete user when confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.deleteUser('student@example.com');

      expect(userService.deleteUser).not.toHaveBeenCalled();
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete user Student User');
    });

    it('should not delete user when user is not found', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteUser('nonexistent@example.com');

      expect(userService.deleteUser).not.toHaveBeenCalled();
      expect(window.confirm).not.toHaveBeenCalled();
    });
  });

  // Test 3: Template Rendering
  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display the correct title', () => {
      const title = fixture.nativeElement.querySelector('.container__title');
      expect(title.textContent.trim()).toBe('Users List'); // Use trim()
    });

    it('should display table with correct headers', () => {
      const table = fixture.nativeElement.querySelector('.container__table');
      const headers = fixture.nativeElement.querySelectorAll('thead th');
      
      expect(table).toBeTruthy();
      expect(headers.length).toBe(5);
      expect(headers[0].textContent).toContain('ID');
      expect(headers[1].textContent).toContain('Name');
      expect(headers[2].textContent).toContain('Email');
      expect(headers[3].textContent).toContain('Role');
      expect(headers[4].textContent).toContain('Operation');
    });

    it('should display all users in the table', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3); // Three users in mock data
    });

    it('should display correct user information in each row', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      
      // First user (Admin)
      const firstRowCells = rows[0].querySelectorAll('td');
      expect(firstRowCells[0].textContent).toBe('1');
      expect(firstRowCells[1].textContent).toBe('Admin User');
      expect(firstRowCells[2].textContent).toBe('admin@example.com');
      expect(firstRowCells[3].textContent).toBe('Admin');
      
      // Second user (Student)
      const secondRowCells = rows[1].querySelectorAll('td');
      expect(secondRowCells[0].textContent).toBe('2');
      expect(secondRowCells[1].textContent).toBe('Student User');
      expect(secondRowCells[2].textContent).toBe('student@example.com');
      expect(secondRowCells[3].textContent).toBe('Student');
    });

    it('should display delete button for each user', () => {
      const deleteButtons = fixture.nativeElement.querySelectorAll('.delete-button');
      expect(deleteButtons.length).toBe(3); // One button per user
      
      deleteButtons.forEach((button: HTMLButtonElement, index: number) => {
        expect(button.textContent).toBe('Delete');
      });
    });

    it('should have correct CSS classes for styling', () => {
      const container = fixture.nativeElement.querySelector('.container');
      const table = fixture.nativeElement.querySelector('.container__table');
      const title = fixture.nativeElement.querySelector('.container__title');
      
      expect(container).toBeTruthy();
      expect(table).toBeTruthy();
      expect(title).toBeTruthy();
    });
  });

  // Test 4: User Interaction
  describe('User Interaction', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call deleteUser with correct email when delete button is clicked', () => {
      spyOn(component, 'deleteUser');
      
      const deleteButtons = fixture.nativeElement.querySelectorAll('.delete-button');
      deleteButtons[0].click(); // Click first user's delete button
      
      expect(component.deleteUser).toHaveBeenCalledWith('admin@example.com');
    });

    it('should call deleteUser with student email when student delete button is clicked', () => {
      spyOn(component, 'deleteUser');
      
      const deleteButtons = fixture.nativeElement.querySelectorAll('.delete-button');
      deleteButtons[1].click(); // Click second user's delete button
      
      expect(component.deleteUser).toHaveBeenCalledWith('student@example.com');
    });
  });

  // Test 5: Edge Cases
  describe('Edge Cases', () => {
    it('should handle empty users list', () => {
      component.users = [];
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(0);
    });

    it('should handle users with missing optional fields', () => {
      const userWithMissingFields: User = {
        name: 'Minimal User',
        email: 'minimal@example.com',
        password: 'password',
        role: 'User',
        fees: [],
        salary: []
        // id and token are optional and missing
      };
      
      component.users = [userWithMissingFields];
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      const cells = rows[0].querySelectorAll('td');
      
      expect(cells[0].textContent).toBe(''); // ID should be empty
      expect(cells[1].textContent).toBe('Minimal User');
      expect(cells[2].textContent).toBe('minimal@example.com');
      expect(cells[3].textContent).toBe('User');
    });

    it('should handle deleteUser being called with empty string', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteUser('');
      
      expect(userService.deleteUser).not.toHaveBeenCalled();
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('should handle deleteUser being called with null', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteUser(null as any);
      
      expect(userService.deleteUser).not.toHaveBeenCalled();
      expect(window.confirm).not.toHaveBeenCalled();
    });
  });

  // Test 6: Service Integration
  describe('Service Integration', () => {
    it('should use UserService for all user operations', () => {
      expect(userService.findUser).toBeDefined();
      expect(userService.deleteUser).toBeDefined();
      expect(userService.getUsers).toBeDefined();
    });

    it('should reflect service changes in component users list', () => {
      const newUsersList = [mockUserService.users[0]]; // Only keep first user
      const getUsersSpy = userService.getUsers as jasmine.Spy;
      getUsersSpy.and.returnValue(newUsersList);
      
      // Simulate service update
      component.users = userService.getUsers();
      
      expect(component.users).toEqual(newUsersList);
      expect(component.users.length).toBe(1);
    });
  });
});