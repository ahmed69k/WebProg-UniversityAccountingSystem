import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Profile } from './profile'; 
import { DepartmentService } from '../../shared/departmentService/departmentService';

describe('Profile Component', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Reset testing module to prevent "Already Instantiated" errors from other tests
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [Profile, HttpClientTestingModule],
      providers: [DepartmentService]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Initial detectChanges triggers ngOnInit automatically. 
    // Since the component likely calls loadDepartments() in ngOnInit, 
    // the HTTP request is sent IMMEDIATELY here.
    fixture.detectChanges();
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all departments via GET', () => {
    /**
     * FIX: We do NOT call component.ngOnInit() manually.
     * fixture.detectChanges() in the beforeEach block already triggered it.
     * We just need to catch the request that was already sent.
     */

    const req = httpMock.expectOne(request => 
      request.url.includes('/departments') && request.method === 'GET'
    );

    // Mock the data returned by the API
    req.flush({ 
      departments: [
        { id: 1, name: 'Finance' },
        { id: 2, name: 'IT' }
      ] 
    });

    // Final check to see if the component processed the data
    fixture.detectChanges();
    
    // If you have a variable like component.departments, you can assert here:
    // expect((component as any).departments.length).toBe(2);
  });
});