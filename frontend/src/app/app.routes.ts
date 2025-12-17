import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { Login } from './components/login/login';

// 1. Just export the array. No @NgModule here!
export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'admin', component: AdminPanel },
  { path: 'login', component: Login },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];