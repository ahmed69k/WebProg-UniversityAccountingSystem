import { NgModule } from '@angular/core';
import { RouterModule ,Routes } from '@angular/router';

import { Home } from './components/home/home';
import { AuthGuard } from './middleware/authentication/auth-guard';

export const routes: Routes = [

  {path: '', component: Home},
  {path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login)},
  {path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.Profile)},
  {path: 'register', loadComponent: () => import('./components/sign-up/sign-up').then(m => m.SignUp)},
  {path: 'student-fees', loadComponent: () => import('./components/student-fees/student-fees').then(m => m.StudentFees)},
  {
    path: 'staff-payroll',
    loadComponent: () => import('./components/staff-payroll/staff-payroll').then(m => m.StaffPayroll),
    canActivate: [AuthGuard], data: {roles: ['Accounting Personnel', "Staff"]}
  },
  {
    path: 'department-budget',
    loadComponent: () => import('./components/department-budget/department-budget').then(m => m.DepartmentBudget),
    canActivate: [AuthGuard], data:{roles: ['Admin', 'Accounting Personnel']}
  },
  {path: 'users', loadComponent: () => import('./components/users/users').then(m => m.Users), canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {path: 'admin-panel', loadComponent: () => import('./components/admin-panel/admin-panel').then(m => m.AdminPanel), canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {path: '**', loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
