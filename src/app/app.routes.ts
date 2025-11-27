import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { AdminOrdersPage } from './pages/admin-orders/admin-orders.page';
import { CustomerOrdersPage } from './pages/customer-orders/customer-orders.page';
import { adminGuard } from './guards/admin.guard';
import { customerGuard } from './guards/customer.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomePage
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        canActivateChild: [adminGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: '/admin/orders' },
            { path: 'orders', component: AdminOrdersPage }
        ]

    },
    {
        path: 'customer',
        canActivate: [customerGuard],
        canActivateChild: [customerGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: '/customer/orders' },
            { path: 'orders', component: CustomerOrdersPage }
        ]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
