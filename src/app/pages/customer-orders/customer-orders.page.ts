import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';
import { Pizza } from '../../models/pizza.model';
import { finalize, tap } from 'rxjs';
import { Order, OrderItemInput } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router, RouterLink } from "@angular/router";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ap-customer-orders',
  imports: [MatButton, MatProgressSpinner, RouterLink],
  templateUrl: './customer-orders.page.html',
  styleUrl: './customer-orders.page.scss'
})
export class CustomerOrdersPage implements OnInit {

  isLoadingPizzas: boolean = false;
  pizzas: Pizza[] = [];

  isLoadingOrders: boolean = false;
  orders: Order[] = [];

  isSavingNewOrder: boolean = false;

  constructor(
    private pizzaService: PizzaService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders().subscribe();
    this.loadPizzas().subscribe();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/'])
  }

  private loadPizzas() {
    this.isLoadingPizzas = true;
    return this.pizzaService.getPizzas().pipe(
      tap(pizzas => this.pizzas = pizzas),
      finalize(() => this.isLoadingPizzas = false)
    );
  }

  private loadOrders() {
    this.isLoadingOrders = true;
    return this.orderService.getOrders().pipe(
      tap(orders => this.orders = orders),
      finalize(() => this.isLoadingOrders = false)
    );
  }

  private addOrder(items: OrderItemInput, notes?: string) {
    this.isSavingNewOrder = true;
    return this.orderService.addOrder({ items, notes }).pipe(
      finalize(() => this.isSavingNewOrder = false)
    )
  }

}
