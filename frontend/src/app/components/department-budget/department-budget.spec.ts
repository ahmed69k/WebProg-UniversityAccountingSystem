import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DepartmentService } from '../../shared/departmentService/departmentService';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // FIX 1: Reset testing module to prevent "Already Instantiated" errors
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartmentService]
    });

    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // FIX 2: Ensure no outstanding requests remain after each test
  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch departments', () => {
    service.getDepartments().subscribe();

    // FIX: Match the exact URL shown in the error message
    const req = httpMock.expectOne('http://localhost:8000/api/departments');
    
    expect(req.request.method).toBe('GET');
    req.flush({ departments: [{}, {}] });
});

  it('should delete by ID (Number)', () => {
    const departmentId = 1;
    
    service.deleteDepartment(departmentId).subscribe();

    // Matching the URL based on the dynamic ID passed
    const req = httpMock.expectOne(r => r.url.includes(`/${departmentId}`));
    expect(req.request.method).toBe('DELETE');
    
    // Flushing a success response
    req.flush({ message: 'Deleted successfully' });
  });
});