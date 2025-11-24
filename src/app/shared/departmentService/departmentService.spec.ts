import { TestBed } from '@angular/core/testing';
import { DepartmentService, Department } from './departmentService';

describe('DepartmentService', () => {
  let service: DepartmentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a department', () => {
    const dep: Department = {
      name: 'IT',
      totalBudget: 10000,
      allocatedBudget: 2000,
      remainingBudget: 8000,
      id: 1
    };

    service.addDepartment(dep);

    expect(service.getDepartments().length).toBe(1);
    expect(JSON.parse(localStorage.getItem('departments')!).length).toBe(1);
  });

  it('should find department by name', () => {
    service.addDepartment({ name: 'Finance', totalBudget: 5000, allocatedBudget: 1000, remainingBudget: 4000 });

    const found = service.findDepartment('Finance');
    expect(found?.name).toBe('Finance');
  });

  it('should delete a department', () => {
    service.addDepartment({ name: 'HR', totalBudget: 3000, allocatedBudget: 500, remainingBudget: 2500 });

    service.deleteDepartment('HR');
    expect(service.getDepartments().length).toBe(0);
  });

  it('should update a department', () => {
    const dep = { name: 'Marketing', totalBudget: 8000, allocatedBudget: 2000, remainingBudget: 6000 };
    service.addDepartment(dep);

    const updated = {
      name: 'Marketing',
      totalBudget: 10000,
      allocatedBudget: 3000,
      remainingBudget: 7000
    };

    const result = service.updateDepartment(updated);
    expect(result).toBeTrue();

    const newDep = service.findDepartment('Marketing');
    expect(newDep?.totalBudget).toBe(10000);
    expect(newDep?.remainingBudget).toBe(7000);
  });
});
