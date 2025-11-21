import { NgModule } from '@angular/core';
import { RouterModule ,Routes } from '@angular/router';

import { Home } from './components/home/home';
import {DepartmentBudget} from './components/department-budget/department-budget';
import {Login} from './components/login/login';
import {NotFound} from './components/not-found/not-found';
import {Profile} from './components/profile/profile';
import {SignUp} from './components/sign-up/sign-up';
import {StaffPayroll} from './components/staff-payroll/staff-payroll';
import {StudentFees} from './components/student-fees/student-fees';
import { Users } from './components/users/users';
import { AuthGuard } from './middleware/authentication/auth-guard';
import { AdminPanel } from './components/admin-panel/admin-panel';

export const routes: Routes = [

  {path: '', component: Home},
  {path: 'login', component: Login},
  {path: 'profile', component: Profile},
  {path: 'register', component: SignUp},
  {path: 'student-fees', component: StudentFees},
  {path: 'staff-payroll', component: StaffPayroll, canActivate: [AuthGuard], data: {roles: ['Accounting Personnel', "Staff"]}},
  {path: 'department-budget', component: DepartmentBudget, canActivate: [AuthGuard], data:{roles: ['Admin', 'Accounting Personnel']}},
  {path: 'users', component: Users, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {path: 'admin-panel', component: AdminPanel, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {path: '**', component: NotFound},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
