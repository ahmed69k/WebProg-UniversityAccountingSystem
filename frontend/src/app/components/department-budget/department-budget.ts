import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department, DepartmentService } from '../../shared/departmentService/departmentService';
import { User, UserService } from '../../shared/userService/userService';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-department-budget',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-budget.html',
  styleUrl: './department-budget.css',
})
export class DepartmentBudget implements AfterViewInit, OnDestroy {

  @ViewChild('budgetChart') budgetChartRef!: ElementRef;
  @ViewChild('distributionChart') distributionChartRef!: ElementRef;
  @ViewChild('utilizationChart') utilizationChartRef!: ElementRef;

  departments: Department[] = [];
  name: string = '';
  totalBudget: number = 0;
  allocatedBudget: number = 0;
  remainingBudget: number = 0;

  editingDepartment: Department | null = null;
  showForm: boolean = false;

  private budgetChart: Chart | null = null;
  private distributionChart: Chart | null = null;
  private utilizationChart: Chart | null = null;

  constructor(
    private departmentService: DepartmentService,
    private userService: UserService
  ) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createCharts();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.budgetChart) {
      this.budgetChart.destroy();
    }
    if (this.distributionChart) {
      this.distributionChart.destroy();
    }
    if (this.utilizationChart) {
      this.utilizationChart.destroy();
    }
  }

  createCharts(): void {
    this.createBudgetChart();
    this.createDistributionChart();
    this.createUtilizationChart();
  }

  createBudgetChart(): void {
    if (!this.budgetChartRef?.nativeElement) return;

    const ctx = this.budgetChartRef.nativeElement.getContext('2d');
    
    this.budgetChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.departments.map(dept => dept.name),
        datasets: [
          {
            label: 'Total Budget',
            data: this.departments.map(dept => dept.totalBudget),
            backgroundColor: '#3498db',
            borderColor: '#2980b9',
            borderWidth: 2
          },
          {
            label: 'Allocated Budget',
            data: this.departments.map(dept => dept.allocatedBudget),
            backgroundColor: '#27ae60',
            borderColor: '#219a52',
            borderWidth: 2
          },
          {
            label: 'Remaining Budget',
            data: this.departments.map(dept => dept.remainingBudget),
            backgroundColor: '#e74c3c',
            borderColor: '#c0392b',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Department Budget Overview'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  createDistributionChart(): void {
    if (!this.distributionChartRef?.nativeElement) return;

    const ctx = this.distributionChartRef.nativeElement.getContext('2d');
    
    this.distributionChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.departments.map(dept => dept.name),
        datasets: [
          {
            data: this.departments.map(dept => dept.totalBudget),
            backgroundColor: [
              '#3498db', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6',
              '#1abc9c', '#d35400', '#34495e', '#16a085', '#8e44ad'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Budget Distribution by Department'
          }
        }
      }
    });
  }

  createUtilizationChart(): void {
    if (!this.utilizationChartRef?.nativeElement) return;

    const ctx = this.utilizationChartRef.nativeElement.getContext('2d');
    
    this.utilizationChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.departments.map(dept => dept.name),
        datasets: [
          {
            label: 'Budget Utilization %',
            data: this.departments.map(dept => 
              dept.totalBudget > 0 ? (dept.allocatedBudget / dept.totalBudget) * 100 : 0
            ),
            backgroundColor: '#9b59b6',
            borderColor: '#8e44ad',
            borderWidth: 3,
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Budget Utilization Percentage'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value: any) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  updateCharts(): void {
    if (this.budgetChart) {
      this.budgetChart.destroy();
    }
    if (this.distributionChart) {
      this.distributionChart.destroy();
    }
    if (this.utilizationChart) {
      this.utilizationChart.destroy();
    }

    this.createCharts();
  }

  // Update your existing methods to refresh charts
  addDepartment(): void {
    const currentDepartment: Department = {
      id: Math.floor(Math.random() * (9999 - 1 + 1)) + 1,
      name: this.name,
      totalBudget: this.totalBudget,
      allocatedBudget: this.allocatedBudget,
      remainingBudget: this.totalBudget - this.allocatedBudget
    };
    
    this.departmentService.addDepartment(currentDepartment);
    this.departments = this.departmentService.getDepartments();
    this.updateCharts();
    this.resetForm();
  }

  updateDepartment(): void {
    if (!this.editingDepartment) return;

    const updatedDepartment: Department = {
      id: this.editingDepartment.id,
      name: this.name,
      totalBudget: this.totalBudget,
      allocatedBudget: this.allocatedBudget,
      remainingBudget: this.totalBudget - this.allocatedBudget
    };

    const success = this.departmentService.updateDepartment(updatedDepartment);
    
    if (success) {
      this.departments = this.departmentService.getDepartments();
      this.updateCharts();
      this.resetForm();
    } else {
      alert('Failed to update department!');
    }
  }

  deleteDepartment(name: string): void {
    const confirmed = window.confirm(`Are you sure you want to delete department: ${name}?`);
    
    if (confirmed) {
      this.departmentService.deleteDepartment(name);
      this.departments = this.departmentService.getDepartments();
      this.updateCharts();
    }
  }

  quickUpdateBudget(department: Department, field: 'totalBudget' | 'allocatedBudget', value: number): void {
    let remainingBudget: number;
    
    if (field === 'totalBudget') {
      remainingBudget = value - department.allocatedBudget;
    } else {
      remainingBudget = department.totalBudget - value;
    }

    const updatedDepartment = {
      ...department,
      [field]: value,
      remainingBudget: remainingBudget
    };

    this.departmentService.updateDepartment(updatedDepartment);
    this.departments = this.departmentService.getDepartments();
    this.updateCharts();
  }

  onSubmit(): void {
    if (this.editingDepartment) {
      this.updateDepartment();
    } else {
      this.addDepartment();
    }
  }

  startEditDepartment(department: Department): void {
    this.editingDepartment = department;
    this.name = department.name;
    this.totalBudget = department.totalBudget;
    this.allocatedBudget = department.allocatedBudget;
    this.remainingBudget = department.remainingBudget;
    this.showForm = true;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.name = '';
    this.totalBudget = 0;
    this.allocatedBudget = 0;
    this.remainingBudget = 0;
    this.editingDepartment = null;
    this.showForm = false;
  }

  calculateRemainingBudget(): void {
    this.remainingBudget = this.totalBudget - this.allocatedBudget;
  }

  getTotalBudget(): number {
    return this.departments.reduce((sum, dept) => sum + dept.totalBudget, 0);
  }

  getTotalAllocated(): number {
    return this.departments.reduce((sum, dept) => sum + dept.allocatedBudget, 0);
  }

  getTotalRemaining(): number {
    return this.departments.reduce((sum, dept) => sum + dept.remainingBudget, 0);
  }

  isAdmin() {
  }
}