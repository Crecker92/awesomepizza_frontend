import { Component, OnInit } from '@angular/core';
import { EMPTY, finalize, switchMap, tap } from 'rxjs';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { MatButton } from "@angular/material/button";
import { Router } from "@angular/router";
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderModal } from '../../modals/add-order/add-order.modal';
import { OrderComponent } from '../../components/order/order.component';
import { PageComponent } from '../../components/page/page.component';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'ap-customer-orders',
  imports: [OrderComponent, PageComponent, MatButton],
  templateUrl: './customer-orders.page.html',
  styleUrl: './customer-orders.page.scss'
})
export class CustomerOrdersPage implements OnInit {
  isLoadingOrders: boolean = false;
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private dialog: MatDialog
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

  openAddOrderDialog() {
    const dialogRef = this.dialog.open(AddOrderModal, {
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(
      switchMap(result => result === 'added' ? this.loadOrders() : EMPTY)
    ).subscribe();
  }

}
