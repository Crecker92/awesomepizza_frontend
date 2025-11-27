import { Component, Input } from '@angular/core';
import { Order, OrderStatus } from '../../models/order.model';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'ap-order',
  imports: [CommonModule, MatCard, MatCardHeader, DatePipe, MatCardContent,
    CurrencyPipe, MatChip],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  @Input({ required: true }) order!: Order;

  getStatus() {
    const statuses: { [status in OrderStatus]: string } = {
      'pending': 'Pending',
      'in-progress': 'In progress',
      'completed': 'Completed'
    };
    return statuses[this.order.status];
  }
}
