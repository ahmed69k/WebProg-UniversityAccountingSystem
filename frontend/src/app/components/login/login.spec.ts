import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login'; 
import { UserService } from '../../shared/userService/userService';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ToastService } from '../../shared/ToastService';

describe('LoginComponent', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'saveUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initializes the form
  });

  it('should navigate to dashboard on success', fakeAsync(() => {
    const form = (component as any).loginForm;
    expect(form).toBeDefined();

    const mockResponse = { 
      message: 'Success', 
      token: '123', 
      user: { id: 1, name: 'Admin', email: 'a@t.com', role: 'Admin', created_at: '', updated_at: '' } 
    };
    userServiceSpy.login.and.returnValue(of(mockResponse));

    form.patchValue({ email: 'admin@test.com', password: '123' });
    (component as any).onSubmit();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show error toast on login failure', fakeAsync(() => {
    userServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid' } })));
    const form = (component as any).loginForm;
    
    form.patchValue({ email: 'wrong@t.com', password: '000' });
    (component as any).onSubmit();
    tick();

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Invalid');
  }));
});