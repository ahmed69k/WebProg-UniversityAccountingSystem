import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Users } from './users'; 
import { UserService } from '../../shared/userService/userService';
import { of } from 'rxjs';

describe('UsersComponent', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;
  let userServiceSpy: any; 

  beforeEach(async () => {
  TestBed.resetTestingModule();

  // Update the spy to use 'getAllUsers'
  userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers', 'deleteUser']);

  await TestBed.configureTestingModule({
    imports: [Users], 
    providers: [{ provide: UserService, useValue: userServiceSpy }]
  }).compileComponents();
  
  fixture = TestBed.createComponent(Users);
  component = fixture.componentInstance;
});

it('should load users on init', fakeAsync(() => {
  const mockData = { users: [{ id: 1, name: 'Admin' }] };
  // Ensure the mock return matches the new name
  userServiceSpy.getAllUsers.and.returnValue(of(mockData));

  fixture.detectChanges(); // triggers ngOnInit -> allUsers()
  tick();

  expect(component.users?.length).toBe(1);
}));

  it('should delete user', fakeAsync(() => {
    userServiceSpy.deleteUser.and.returnValue(of({ message: 'Deleted' }));
    
    component.deleteUser(1); 
    tick();

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(1);
  }));
});