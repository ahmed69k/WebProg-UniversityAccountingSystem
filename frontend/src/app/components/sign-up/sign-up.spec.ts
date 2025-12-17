import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignUp } from './sign-up';
import { UserService } from '../../shared/userService/userService';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;
  let userServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    userServiceSpy = jasmine.createSpyObj('UserService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    // FIX: Trigger ngOnInit to initialize the form
    fixture.detectChanges(); 
  });

  it('should navigate on successful signup', fakeAsync(() => {
    const form = (component as any).signupForm;
    expect(form).toBeDefined(); // Now it will be defined

    form.patchValue({ name: 'Nour', email: 'test@test.com', password: '123', role: 'Student' });
    userServiceSpy.register.and.returnValue(of({ message: 'Success' }));

    (component as any).onSubmit();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));
});