import { TestBed } from '@angular/core/testing';
import { UserService, User } from './userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add user', () => {
    const user: User = {
      name: 'Hannah',
      email: 'hannah@test.com',
      password: '123',
      role: 'Student',
      fees: [],
      salary: []
    };

    service.addUser(user);

    expect(service.getUsers().length).toBe(1);
    expect(JSON.parse(localStorage.getItem('users')!).length).toBe(1);
  });

  it('should find user by email', () => {
    service.addUser({
      name: 'Ali',
      email: 'ali@test.com',
      password: '123',
      role: 'Staff',
      fees: [],
      salary: []
    });

    const found = service.findUser('ali@test.com');
    expect(found?.name).toBe('Ali');
  });

  it('should update token', () => {
    const user = {
      name: 'Samar',
      email: 'samar@test.com',
      password: '123',
      role: 'Admin',
      fees: [],
      salary: []
    };

    service.addUser(user);
    service.updateToken('samar@test.com', 'TOKEN123');

    const updated = service.findUser('samar@test.com');
    expect(updated?.token).toBe('TOKEN123');
  });

  it('should delete user', () => {
    service.addUser({
      name: 'Mario',
      email: 'mario@test.com',
      password: '123',
      role: 'Staff',
      fees: [],
      salary: []
    });

    service.deleteUser('mario@test.com');
    expect(service.getUsers().length).toBe(0);
  });
});
