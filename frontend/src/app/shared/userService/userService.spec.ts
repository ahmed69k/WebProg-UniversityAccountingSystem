import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.resetTestingModule(); // Clear previous runs
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  // Keep your other "it" blocks here
});