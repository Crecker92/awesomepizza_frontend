import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order, OrderInput } from '../models/order.model';
import { API_URL } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  getOrders() {
    return this.http.get<Order[]>(`${API_URL}/orders`);
  }

  getOrder(id: string) {
    return this.http.get<Order>(`${API_URL}/orders/${id}`)
  }

  addOrder(order: OrderInput) {
    return this.http.post<Order>(`${API_URL}/orders`, order);
  }

  setOrderInProgress(id: string) {
    return this.http.patch<Order>(`${API_URL}/orders/${id}/status/in-progress`, null);
  }

  setOrderCompleted(id: string) {
    return this.http.patch<Order>(`${API_URL}/orders/${id}/status/completed`, null);
  }
}
