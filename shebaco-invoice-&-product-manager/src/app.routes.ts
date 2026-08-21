
import { Routes } from '@angular/router';

// Lazy load the components for better performance and initial load times.
export const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'invoice-builder',
    loadComponent: () => import('./components/invoice-builder.component').then(m => m.InvoiceBuilderComponent)
  },
  {
    path: 'flyer-designer',
    loadComponent: () => import('./components/flyer-designer.component').then(m => m.FlyerDesignerComponent)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
