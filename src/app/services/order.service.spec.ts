import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Order, OrderRaw } from '../models/order.model';
import { API_URL } from '../../environment/environment';

describe('OrderService', () => {
  let service: OrderService;
  let httpTestingController: HttpTestingController;

  const mockUsers: User[] = [
    { id: '1', name: 'Customer One', role: 'customer' },
    { id: '2', name: 'Customer Two', role: 'customer' }
  ];

  const mockRawOrders: OrderRaw[] = [
    { id: '1', customer: mockUsers[0], items: [], status: 'pending', createdAt: new Date().toISOString(), updatedAt: undefined, totalPrice: 1 },
    { id: '2', customer: mockUsers[0], items: [], status: 'in-progress', createdAt: new Date().toISOString(), updatedAt: undefined, totalPrice: 2 },
    { id: '3', customer: mockUsers[1], items: [], status: 'completed', createdAt: new Date().toISOString(), updatedAt: undefined, totalPrice: 3 },
  ];

  const mockOrders: Order[] = [
    { id: '1', customer: mockUsers[0], items: [], status: 'pending', createdAt: new Date(), updatedAt: undefined, totalPrice: 1 },
    { id: '2', customer: mockUsers[0], items: [], status: 'in-progress', createdAt: new Date(), updatedAt: undefined, totalPrice: 2 },
    { id: '3', customer: mockUsers[1], items: [], status: 'completed', createdAt: new Date(), updatedAt: undefined, totalPrice: 3 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(OrderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all orders', () => {
    service.getOrders().subscribe(orders => {
      expect(orders).toEqual(mockOrders);
      expect(orders.length).toBe(mockOrders.length);
    });

    const req = httpTestingController.expectOne(`${API_URL}/orders`);
    expect(req.request.method).toBe('GET');

    req.flush(mockRawOrders);
  });

  it('should retrieve order by id', () => {
    const requestedOrder = mockOrders[0];
    const requestedRawOrder = mockRawOrders[0];

    service.getOrder(requestedOrder.id).subscribe(order => {
      expect(order).toEqual(requestedOrder);
    });

    const req = httpTestingController.expectOne(`${API_URL}/orders/${requestedOrder.id}`);
    expect(req.request.method).toBe('GET');

    req.flush(requestedRawOrder);
  });

  it('should add new order', () => {
    const resultOrder = mockOrders[1];
    const resultRawOrder = mockRawOrders[1];

    service.addOrder({ items: [] }).subscribe(order => {
      expect(order).toEqual(resultOrder);
    });

    const req = httpTestingController.expectOne(`${API_URL}/orders`);
    expect(req.request.method).toBe('POST');

    req.flush(resultRawOrder);
  });

  it('should set order in progress', () => {
    const resultOrder = mockOrders[1];
    const resultRawOrder = mockRawOrders[1]
    service.setOrderInProgress(resultOrder.id).subscribe();
    const req = httpTestingController.expectOne(`${API_URL}/orders/${resultOrder.id}/status/in-progress`);
    expect(req.request.method).toBe('PATCH');
    req.flush(resultRawOrder);
  });

  it('should set order completed', () => {
    const resultOrder = mockOrders[2];
    const resultRawOrder = mockRawOrders[2]
    service.setOrderCompleted(resultOrder.id).subscribe();
    const req = httpTestingController.expectOne(`${API_URL}/orders/${resultOrder.id}/status/completed`);
    expect(req.request.method).toBe('PATCH');
    req.flush(resultRawOrder);
  });
});
