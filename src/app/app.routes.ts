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
import { Users } from './components/users/users/users';

export const routes: Routes = [

    {path: '', component: Home},
    {path: 'department-budget', component: DepartmentBudget},
    {path: 'login', component: Login},
    {path: 'profile', component: Profile},
    {path: 'register', component: SignUp},
    {path: 'staff-payroll', component: StaffPayroll},
    {path: 'student-fees', component: StudentFees},
    {path: 'users', component: Users},
    {path: '**', component: NotFound},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
