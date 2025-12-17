import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentFees } from './student-fees';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StudentFees Component', () => {
  let component: StudentFees;
  let fixture: ComponentFixture<StudentFees>;

  beforeEach(async () => {
    // FIX 1: Reset the testing module to prevent the "already instantiated" error
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [
        StudentFees, 
        HttpClientTestingModule // FIX 2: Added because your component likely uses a service with HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});