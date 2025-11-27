import { Component, OnInit } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from "@angular/router";
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderModal } from '../../components/add-order/add-order.modal';
import { OrderComponent } from '../../components/order/order.component';

@Component({
  selector: 'ap-customer-orders',
  imports: [MatButton, MatProgressSpinner, OrderComponent],
  templateUrl: './customer-orders.page.html',
  styleUrl: './customer-orders.page.scss'
})
export class CustomerOrdersPage implements OnInit {
  isLoadingOrders: boolean = false;
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
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
      tap(orders => this.orders = orders),
      finalize(() => this.isLoadingOrders = false)
    );
  }

  openAddOrderDialog() {
    this.dialog.open(AddOrderModal, {
      disableClose: true,
    });
  }

}
