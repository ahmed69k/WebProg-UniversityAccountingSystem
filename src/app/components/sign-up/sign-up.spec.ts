import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SignUp } from './sign-up';
import { UserService, User } from '../../shared/userService/userService';
import { Button } from '../../shared/button/button';

// Mock services for isolated testing
class MockUserService {
  users: User[] = [{ id: 1, name: 'Existing User', email: 'exists@test.com', password: 'password', role: 'Student', fees: [], salary: [] }];

  findUser(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  addUser(user: User): void {
    this.users.push(user);
  }
}

class MockRouter {
  navigate(path: string[]): void {}
}

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;
  let userService: UserService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, Button, SignUp],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);

    // Mock window.alert and spies for service methods
    spyOn(window, 'alert');
    spyOn(userService, 'addUser').and.callThrough();
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should show an alert if the email is already in use', () => {
      // Arrange
      component.email = 'exists@test.com';

      // Act
      component.onSubmit();

      // Assert
      expect(window.alert).toHaveBeenCalledWith('Email already in use!');
      expect(userService.addUser).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should add a new user with the "Student" role and navigate to login', () => {
      // Arrange
      component.name = 'New Student';
      component.email = 'student@test.com';
      component.password = 'password';
      component.role = 'Student';

      // Act
      component.onSubmit();

      // Assert
      expect(userService.addUser).toHaveBeenCalled();
      const addedUser = (userService.addUser as jasmine.Spy).calls.mostRecent().args[0];
      expect(addedUser.role).toBe('Student');
      expect(addedUser.id).toBeGreaterThanOrEqual(13000001);
      expect(addedUser.id).toBeLessThanOrEqual(13009999);
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should add a new user with the "Staff" role and navigate to login', () => {
      // Arrange
      component.name = 'New Staff';
      component.email = 'staff@test.com';
      component.password = 'password';
      component.role = 'Staff';

      // Act
      component.onSubmit();

      // Assert
      expect(userService.addUser).toHaveBeenCalled();
      const addedUser = (userService.addUser as jasmine.Spy).calls.mostRecent().args[0];
      expect(addedUser.role).toBe('Staff');
      expect(addedUser.id).toBeGreaterThanOrEqual(14000001);
      expect(addedUser.id).toBeLessThanOrEqual(14009999);
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should add a new user with the "Accounting Personnel" role and navigate to login', () => {
        // Arrange
        component.name = 'New AP';
        component.email = 'ap@test.com';
        component.password = 'password';
        component.role = 'Accounting Personnel';
  
        // Act
        component.onSubmit();
  
        // Assert
        expect(userService.addUser).toHaveBeenCalled();
        const addedUser = (userService.addUser as jasmine.Spy).calls.mostRecent().args[0];
        expect(addedUser.role).toBe('Accounting Personnel');
        expect(addedUser.id).toBeGreaterThanOrEqual(15000001);
        expect(addedUser.id).toBeLessThanOrEqual(15009999);
        expect(router.navigate).toHaveBeenCalledWith(['login']);
      });
  });
});