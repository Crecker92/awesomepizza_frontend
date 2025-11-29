import { Component, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza.model';
import { OrderService } from '../../services/order.service';
import { OrderItemInput } from '../../models/order.model';
import { finalize, tap } from 'rxjs';
import { MatDialogContent, MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { PizzaService } from '../../services/pizza.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'ap-add-order',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
    MatButton, MatInput, MatIcon, MatIconButton, CurrencyPipe],
  templateUrl: './add-order.modal.html',
  styleUrl: './add-order.modal.scss'
})
export class AddOrderModal implements OnInit {
  isLoadingPizzas: boolean = false;
  pizzas: Pizza[] = [];

  isSavingNewOrder: boolean = false;
  selection: { [id: string]: number } = {}

  constructor(
    private orderService: OrderService,
    private pizzaService: PizzaService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<AddOrderModal>
  ) { }

  ngOnInit(): void {
    this.loadPizzas().pipe(
      tap(() => this.initializeSelection())
    ).subscribe();
  }

  private loadPizzas() {
    this.isLoadingPizzas = true;
    return this.pizzaService.getPizzas().pipe(
      tap({
        next: pizzas => this.pizzas = pizzas,
        error: () => this.alertService.openErrorAlert('Could not load the list of pizzas. Try again.')
      }),
      finalize(() => this.isLoadingPizzas = false)
    );
  }

  private initializeSelection() {
    this.selection = this.pizzas.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {});
  }

  canPay() {
    return !this.isSavingNewOrder && !this.isLoadingPizzas
      && Object.values(this.selection).some(q => q > 0);
  }

  pay() {
    const items: OrderItemInput[] = Object.entries(this.selection)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({ id, quantity }));
    this.addOrder(items).subscribe({
      next: () => this.dialogRef.close('added'),
      error: () => this.alertService.openErrorAlert("Could not place your order. Try again.")
    });
  }

  private addOrder(items: OrderItemInput[], notes?: string) {
    this.isSavingNewOrder = true;
    return this.orderService.addOrder({ items, notes }).pipe(
      finalize(() => this.isSavingNewOrder = false)
    )
  }

  increase(id: string) {
    if (id in this.selection) {
      this.selection[id] += 1;
    }
  }

  decrease(id: string) {
    if (id in this.selection) {
      this.selection[id] = this.selection[id] <= 0 ? 0 : this.selection[id] - 1;
    }
  }

  getTotal() {
    return Object.entries(this.selection)
      .map(([pizzaId, quantity]) => {
        const unitPrice = this.pizzas.find(p => p.id === pizzaId)?.price || 0;
        return unitPrice * quantity;
      })
      .reduce((acc, p) => acc += p, 0);
  }

}
