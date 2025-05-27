import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [() => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        window.location.href = '/login';
        return false;
      }
      return true;
    }]
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' }
];
