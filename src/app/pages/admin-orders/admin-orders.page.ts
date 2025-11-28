import { Component } from '@angular/core';
import { Order, OrderAction } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs';
import { OrderComponent } from '../../components/order/order.component';
import { MatButton } from '@angular/material/button';
import { PageComponent } from '../../components/page/page.component';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'ap-admin-orders',
  imports: [PageComponent, OrderComponent, MatButton],
  templateUrl: './admin-orders.page.html',
  styleUrl: './admin-orders.page.scss'
})
export class AdminOrdersPage {
  isLoadingOrders: boolean = false;
  isChangingOrderStatus: boolean = false;
  private orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders().subscribe();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/'])
  }

  private loadOrders() {
    this.isLoadingOrders = true;
    return this.orderService.getOrders().pipe(
      tap({
        next: orders => {
          this.orders = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        },
        error: () => {
          this.alertService.openErrorAlert("Unable to load orders. Refresh page.")
        }
      }),
      finalize(() => this.isLoadingOrders = false)
    );
  }

  private setOrderInProgress(orderId: string) {
    this.isChangingOrderStatus = true;
    return this.orderService.setOrderInProgress(orderId).pipe(
      tap({
        error: () => this.alertService.openErrorAlert("Could not set order in progress. Try again.")
      }),
      switchMap(() => this.loadOrders()),
      finalize(() => this.isChangingOrderStatus = false)
    );
  }

  private setOrderCompleted(orderId: string) {
    this.isChangingOrderStatus = true;
    return this.orderService.setOrderCompleted(orderId).pipe(
      tap({
        error: () => this.alertService.openErrorAlert("Could not set order as completed. Try again.")
      }),
      switchMap(() => this.loadOrders()),
      finalize(() => this.isChangingOrderStatus = false)
    );
  }

  get orderInProgress(): Order | undefined {
    return this.orders.find(order => order.status === 'in-progress');
  }

  get ordersQueue(): Order[] {
    return this.orders.filter(order => order.status === 'pending');
  }

  get completedOrders(): Order[] {
    return this.orders.filter(order => order.status === 'completed')
  }

  get orderInProgressActions(): OrderAction[] {
    return [
      {
        label: 'Set Completed',
        handler: order => this.setOrderCompleted(order.id).subscribe(),
        disabled: () => this.isChangingOrderStatus
      }
    ];
  }

  get orderInQueueActions(): OrderAction[] {
    return [
      {
        label: 'Set In Progress',
        handler: order => this.setOrderInProgress(order.id).subscribe(),
        disabled: () => this.isChangingOrderStatus || !!this.orderInProgress
      }
    ];
  }
}
