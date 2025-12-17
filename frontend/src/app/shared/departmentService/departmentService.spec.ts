import { TestBed } from '@angular/core/testing';
import { DepartmentService } from './departmentService';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DepartmentService', () => {
  let service: DepartmentService;

  beforeEach(() => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      // FIX: You must import HttpClientTestingModule for any service using HttpClient
      imports: [HttpClientTestingModule],
      providers: [DepartmentService]
    });
    service = TestBed.inject(DepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});