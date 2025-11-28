import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderRaw, OrderInput, Order } from '../models/order.model';
import { API_URL } from '../../environment/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  getOrders() {
    return this.http.get<OrderRaw[]>(`${API_URL}/orders`).pipe(
      map(raws => raws.map(raw => this.mapOrderRawToOrder(raw)))
    );
  }

  getOrder(id: string) {
    return this.http.get<OrderRaw>(`${API_URL}/orders/${id}`).pipe(
      map(raw => this.mapOrderRawToOrder(raw))
    );
  }

  addOrder(order: OrderInput) {
    return this.http.post<OrderRaw>(`${API_URL}/orders`, order).pipe(
      map(raw => this.mapOrderRawToOrder(raw))
    );
  }

  setOrderInProgress(id: string) {
    return this.http.patch<OrderRaw>(`${API_URL}/orders/${id}/status/in-progress`, null).pipe(
      map(raw => this.mapOrderRawToOrder(raw))
    );
  }

  setOrderCompleted(id: string) {
    return this.http.patch<OrderRaw>(`${API_URL}/orders/${id}/status/completed`, null).pipe(
      map(raw => this.mapOrderRawToOrder(raw))
    );
  }

  private mapOrderRawToOrder(raw: OrderRaw): Order {
    return {
      ...raw,
      createdAt: new Date(raw.createdAt),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : undefined
    };
  }
}
