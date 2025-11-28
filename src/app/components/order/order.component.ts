import { Component, Input } from '@angular/core';
import { Order, OrderAction, OrderStatus } from '../../models/order.model';
import { MatCard, MatCardHeader, MatCardContent, MatCardActions } from '@angular/material/card';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatChip } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'ap-order',
  imports: [CommonModule, MatCard, MatCardHeader, DatePipe, MatCardContent,
    CurrencyPipe, MatChip, MatCardActions, MatButton],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  @Input({ required: true }) order!: Order;
  @Input() actions?: OrderAction[];

  getStatus() {
    const statuses: { [status in OrderStatus]: string } = {
      'pending': 'Pending',
      'in-progress': 'In progress',
      'completed': 'Completed'
    };
    return statuses[this.order.status];
  }
}
