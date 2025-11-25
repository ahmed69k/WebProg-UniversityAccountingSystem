import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Login } from './login';
import { UserService, User } from '../../shared/userService/userService';
import { Button } from '../../shared/button/button';

// Mock UserService for isolated testing
class MockUserService {
  users: User[] = [
    { id: 1, name: 'Test User', email: 'test@example.com', password: 'password123', role: 'Student', fees: [], salary: [], token: '' },
    { id: 2, name: 'Admin User', email: 'admin@example.com', password: 'adminpassword', role: 'Admin', fees: [], salary: [], token: '' }
  ];

  findUser(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  updateToken(email: string, token: string): void {
    const user = this.findUser(email);
    if (user) {
      user.token = token;
    }
  }
}

class MockRouter {
  navigate(path: string[]): void {}
}

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let userService: UserService;
  let router: Router;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['setItem', 'getItem']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, Button, Login],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    // Mock global localStorage
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);

    // Mock window.alert and console.log
    spyOn(window, 'alert');
    spyOn(console, 'log');
    spyOn(userService, 'updateToken').and.callThrough();
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('should log "User not found!" and not proceed if user does not exist', () => {
      component.email = 'nonexistent@example.com';
      component.password = 'anypassword';

      component.login();

      expect(console.log).toHaveBeenCalledWith('User not found!');
      expect(window.alert).not.toHaveBeenCalled();
      expect(userService.updateToken).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should alert "Incorrect Password!" and not proceed if password is wrong', () => {
      component.email = 'test@example.com';
      component.password = 'wrongpassword';

      component.login();

      expect(console.log).not.toHaveBeenCalled(); // Should not log "User not found!"
      expect(window.alert).toHaveBeenCalledWith('Incorrect Password!');
      expect(userService.updateToken).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should successfully log in, update token, set localStorage, and navigate to profile', () => {
      component.email = 'test@example.com';
      component.password = 'password123';

      component.login();

      expect(console.log).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(userService.updateToken).toHaveBeenCalledWith(component.email, jasmine.any(String));
      expect(localStorage.setItem).toHaveBeenCalledWith('token', jasmine.any(String));
      expect(router.navigate).toHaveBeenCalledWith(['profile']);

      // Verify the token format (base64 encoded email:timestamp)
      const storedToken = localStorageSpy.setItem.calls.mostRecent().args[1];
      expect(atob(storedToken)).toMatch(/^test@example\.com:\d+$/);
    });
  });
});