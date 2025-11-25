import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from './profile';
import { UserService, User } from '../../shared/userService/userService';
import { Button } from '../../shared/button/button';

// Mock UserService
const mockUserService = {
  users: [
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Student',
      token: 'test-token-123',
      id: 1,
      fees: [],
      salary: [],
      profilePicture: 'data:image/png;base64,test-image-data'
    },
    {
      name: 'Another User',
      email: 'another@example.com',
      password: 'password456',
      role: 'Admin',
      token: 'test-token-456',
      id: 2,
      fees: [],
      salary: []
    }
  ],
  findUser: jasmine.createSpy('findUser').and.callFake((email: string) => {
    return mockUserService.users.find(u => u.email === email);
  }),
  updateUser: jasmine.createSpy('updateUser'),
  addProfilePicture: jasmine.createSpy('addProfilePicture')
};

// Mock Button component
const mockButtonComponent = {
  // Mock button component if needed, or use actual component
};

describe('ProfileComponent', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, Profile, Button],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);

    // Set up localStorage
    localStorage.setItem('token', 'test-token-123');
    
    // Reset spy calls
    Object.values(mockUserService).forEach((spy: any) => {
      if (spy.calls && spy.calls.reset) {
        spy.calls.reset();
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test 1: Component Creation and Initialization
  describe('Component Creation', () => {
    it('should create the profile component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with current user based on token', () => {
      // Recreate component with proper localStorage setup
      localStorage.setItem('token', 'test-token-123');
      const freshFixture = TestBed.createComponent(Profile);
      const freshComponent = freshFixture.componentInstance;
      
      expect(freshComponent.currentUser).toEqual(mockUserService.users[0]);
    });

    it('should initialize with showSettings as false', () => {
      expect(component.showSettings).toBeFalse();
    });

    it('should handle missing token gracefully', () => {
      localStorage.removeItem('token');
      const testFixture = TestBed.createComponent(Profile);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.currentUser).toBeUndefined();
    });

    it('should handle invalid token gracefully', () => {
      localStorage.setItem('token', 'invalid-token');
      const testFixture = TestBed.createComponent(Profile);
      const testComponent = testFixture.componentInstance;
      
      expect(testComponent.currentUser).toBeUndefined();
    });
  });

  // Test 2: User Information Methods
  describe('User Information Methods', () => {
    beforeEach(() => {
      component.currentUser = { ...mockUserService.users[0] };
    });

    describe('changeUsername()', () => {
      it('should update username when currentUser exists', () => {
        const newUsername = 'New Username';
        
        component.changeUsername(newUsername);

        expect(component.currentUser?.name).toBe(newUsername);
        expect(userService.updateUser).toHaveBeenCalledWith(jasmine.any(Object));
        // OR be more specific:
        expect(userService.updateUser).toHaveBeenCalledWith(jasmine.objectContaining({
          name: jasmine.any(String),
          email: jasmine.any(String)
        }));      
      });

      it('should not update username when currentUser is undefined', () => {
        component.currentUser = undefined;
        
        component.changeUsername('New Username');

        expect(userService.updateUser).not.toHaveBeenCalled();
      });
    });

    describe('changeEmail()', () => {
      it('should update email when email is not in use', () => {
        const newEmail = 'newemail@example.com';
        
        component.changeEmail(newEmail);

        expect(component.currentUser?.email).toBe(newEmail);
        expect(userService.updateUser).toHaveBeenCalledWith(jasmine.any(Object));
        // OR be more specific:
        expect(userService.updateUser).toHaveBeenCalledWith(jasmine.objectContaining({
          name: jasmine.any(String),
          email: jasmine.any(String)
        }));
      });

      it('should not update email when email is already in use', () => {
        const existingEmail = 'another@example.com';
        
        component.changeEmail(existingEmail);

        expect(component.currentUser?.email).not.toBe(existingEmail);
        expect(userService.updateUser).not.toHaveBeenCalled();
      });

      it('should not update email when currentUser is undefined', () => {
        component.currentUser = undefined;
        
        component.changeEmail('newemail@example.com');

        expect(userService.updateUser).not.toHaveBeenCalled();
      });
    });

    describe('changePassword()', () => {
      it('should update password when currentUser exists', () => {
        const newPassword = 'newPassword123';
        
        component.changePassword(newPassword);

        expect(component.currentUser?.password).toBe(newPassword);
        expect(userService.updateUser).toHaveBeenCalledWith(jasmine.any(Object));
        // OR be more specific:
        expect(userService.updateUser).toHaveBeenCalledWith(jasmine.objectContaining({
          name: jasmine.any(String),
          email: jasmine.any(String)
        }));
      });

      it('should not update password when currentUser is undefined', () => {
        component.currentUser = undefined;
        
        component.changePassword('newPassword123');

        expect(userService.updateUser).not.toHaveBeenCalled();
      });
    });
  });

  // Test 3: Profile Picture Methods
  describe('Profile Picture Methods', () => {
    beforeEach(() => {
      component.currentUser = { ...mockUserService.users[0] };
    });

    it('should handle profile picture change', () => {
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockEvent = { target: { files: [mockFile] } };
      
      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jasmine.createSpy('readAsDataURL'),
        result: 'data:image/png;base64,new-image-data',
        onload: null as any
      };
      spyOn(window, 'FileReader').and.returnValue(mockFileReader as any);
      
      component.changeProfilePicture(mockEvent);

      // Trigger the onload callback
      mockFileReader.onload?.();

      expect(userService.addProfilePicture).toHaveBeenCalledWith(
        jasmine.any(String),
        'data:image/png;base64,new-image-data'
      );
    });

    it('should not handle profile picture change when currentUser is undefined', () => {
      component.currentUser = undefined;
      const mockEvent = { target: { files: [new File([''], 'test.png')] } };
      
      component.changeProfilePicture(mockEvent);

      expect(userService.addProfilePicture).not.toHaveBeenCalled();
    });

    it('should handle no file selected', () => {
      const mockEvent = { target: { files: [] } };
      
      // Mock FileReader to prevent actual file reading
      spyOn(window, 'FileReader').and.returnValue({
        readAsDataURL: jasmine.createSpy('readAsDataURL'),
        result: null,
        onload: null
      } as any);
      
      // This should not throw an error
      expect(() => component.changeProfilePicture(mockEvent)).not.toThrow();
      
      // Verify no service calls were made
      expect(userService.addProfilePicture).not.toHaveBeenCalled();
    });
  });

  // Test 4: Settings Toggle
  describe('Settings Toggle', () => {
    it('should toggle showSettings flag', () => {
      expect(component.showSettings).toBeFalse();
      
      // Show settings
      component.showSettings = true;
      expect(component.showSettings).toBeTrue();
      
      // Hide settings
      component.showSettings = false;
      expect(component.showSettings).toBeFalse();
    });
  });

  // Test 5: Template Rendering
  describe('Template Rendering', () => {
    beforeEach(() => {
      component.currentUser = mockUserService.users[0];
    });

    it('should display user information when currentUser exists', () => {
      // Use fresh user data to avoid contamination
      component.currentUser = { ...mockUserService.users[0] };
      fixture.detectChanges();

      // Get the second profile-section (user info section)
      const profileSections = fixture.nativeElement.querySelectorAll('.profile-section');
      const userInfoSection = profileSections[1]; // Second section has user info
      const headings = userInfoSection.querySelectorAll('h4');
      
      expect(headings.length).toBe(4);
      expect(headings[0].textContent).toContain('ID: 1');
      expect(headings[1].textContent).toContain('Username: Test User');
      expect(headings[2].textContent).toContain('Email: test@example.com');
      expect(headings[3].textContent).toContain('Role: Student');
    });

    it('should handle profile picture change', () => {
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockEvent = { target: { files: [mockFile] } };
      
      // Just verify that FileReader is used and the method doesn't throw
      spyOn(window, 'FileReader').and.returnValue({
        readAsDataURL: jasmine.createSpy('readAsDataURL'),
        onload: null
      } as any);
      
      expect(() => component.changeProfilePicture(mockEvent)).not.toThrow();
      expect(window.FileReader).toHaveBeenCalled();
    });

    it('should display profile picture placeholder when no picture', () => {
      component.currentUser = mockUserService.users[1]; // User without profile picture
      fixture.detectChanges();

      const profilePicture = fixture.nativeElement.querySelector('.profile-picture');
      const placeholder = fixture.nativeElement.querySelector('.profile-picture-placeholder');
      
      expect(profilePicture).toBeFalsy();
      expect(placeholder).toBeTruthy();
      expect(placeholder.textContent.trim()).toBe('No Image'); // Use trim()
    });

    it('should show settings container when showSettings is true', () => {
      component.showSettings = true;
      fixture.detectChanges();

      const settingsContainer = fixture.nativeElement.querySelector('.settings-container');
      expect(settingsContainer).toBeTruthy();
    });

    it('should hide settings container when showSettings is false', () => {
      component.showSettings = false;
      fixture.detectChanges();

      const settingsContainer = fixture.nativeElement.querySelector('.settings-container');
      expect(settingsContainer).toBeFalsy();
    });

    it('should display correct toggle button text', () => {
      // When settings are hidden
      component.showSettings = false;
      fixture.detectChanges();
      
      let toggleButton = fixture.nativeElement.querySelector('.toggle-btn');
      expect(toggleButton.textContent).toContain('Show Settings');

      // When settings are shown
      component.showSettings = true;
      fixture.detectChanges();
      
      toggleButton = fixture.nativeElement.querySelector('.toggle-btn');
      expect(toggleButton.textContent).toContain('Hide Settings');
    });

    it('should display all settings cards when settings are shown', () => {
      component.showSettings = true;
      fixture.detectChanges();

      const settingsCards = fixture.nativeElement.querySelectorAll('.settings-card');
      expect(settingsCards.length).toBe(3);
      
      expect(settingsCards[0].querySelector('h3').textContent).toContain('Change Username');
      expect(settingsCards[1].querySelector('h3').textContent).toContain('Change Email');
      expect(settingsCards[2].querySelector('h3').textContent).toContain('Change Password');
    });
  });

  // Test 6: Form Input Interactions
  describe('Form Input Interactions', () => {
    beforeEach(() => {
      component.currentUser = mockUserService.users[0];
      component.showSettings = true;
      fixture.detectChanges();
    });

    it('should call changeUsername when update username button is clicked', () => {
      spyOn(component, 'changeUsername');
      
      const usernameInput = fixture.nativeElement.querySelector('#newUsername');
      const updateButton = fixture.nativeElement.querySelector('.settings-card:nth-child(1) .btn');
      
      usernameInput.value = 'New Username';
      usernameInput.dispatchEvent(new Event('input'));
      updateButton.click();
      
      expect(component.changeUsername).toHaveBeenCalledWith('New Username');
    });

    it('should call changeEmail when update email button is clicked', () => {
      spyOn(component, 'changeEmail');
      
      const emailInput = fixture.nativeElement.querySelector('#newEmail');
      const updateButton = fixture.nativeElement.querySelector('.settings-card:nth-child(2) .btn');
      
      emailInput.value = 'new@example.com';
      emailInput.dispatchEvent(new Event('input'));
      updateButton.click();
      
      expect(component.changeEmail).toHaveBeenCalledWith('new@example.com');
    });

    it('should call changePassword when update password button is clicked', () => {
      spyOn(component, 'changePassword');
      
      const passwordInput = fixture.nativeElement.querySelector('#newPassword');
      const updateButton = fixture.nativeElement.querySelector('.settings-card:nth-child(3) .btn');
      
      passwordInput.value = 'newPassword123';
      passwordInput.dispatchEvent(new Event('input'));
      updateButton.click();
      
      expect(component.changePassword).toHaveBeenCalledWith('newPassword123');
    });
  });

  // Test 7: Alert Notifications
  describe('Alert Notifications', () => {
    beforeEach(() => {
      spyOn(window, 'alert');
      component.currentUser = mockUserService.users[0];
    });

    it('should show alert when password is changed', () => {
      component.changePassword('newPassword');
      
      expect(window.alert).toHaveBeenCalledWith('Password changed successfully!');
    });

    it('should show alert when email is changed', () => {
      component.changeEmail('new@example.com');
      
      expect(window.alert).toHaveBeenCalledWith('Email changed successfully!');
    });

    it('should show alert when username is changed', () => {
      component.changeUsername('New Username');
      
      expect(window.alert).toHaveBeenCalledWith('Username changed successfully!');
    });

    it('should show alert when email already exists', () => {
      component.changeEmail('another@example.com'); // Existing email
      
      expect(window.alert).toHaveBeenCalledWith('Email already in use!');
    });
  });
});