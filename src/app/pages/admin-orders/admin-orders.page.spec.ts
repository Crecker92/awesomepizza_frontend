import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersPage } from './admin-orders.page';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { Order, OrderItem } from '../../models/order.model';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderComponent } from '../../components/order/order.component';
import { MatButton } from '@angular/material/button';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('AdminOrdersPage', () => {
  let component: AdminOrdersPage;
  let fixture: ComponentFixture<AdminOrdersPage>;
  let orderService: OrderService;
  let userService: UserService;
  let alertService: AlertService;
  let router: Router;

  const customerMock: User = {
    id: '2',
    name: 'Amedeo',
    role: 'customer'
  };

  const pizzaItemMock1: OrderItem = { pizza: { id: '1', name: 'Margherita', price: 10.00 }, quantity: 2 };
  const pizzaItemMock2: OrderItem = { pizza: { id: '2', name: 'Pepperoni', price: 12.50 }, quantity: 1 };

  const inProgressOrder: Order = {
    id: '12345',
    customer: customerMock,
    createdAt: new Date(),
    status: 'in-progress',
    totalPrice: 45.00,
    items: [pizzaItemMock1, pizzaItemMock2],
  };

  const pendingOrder: Order = {
    id: '32415',
    customer: customerMock,
    createdAt: new Date(),
    status: 'pending',
    totalPrice: 45.00,
    items: [pizzaItemMock1, pizzaItemMock2],
  };

  const completedOrder: Order = {
    id: '54321',
    customer: customerMock,
    createdAt: new Date(),
    status: 'completed',
    totalPrice: 45.00,
    items: [pizzaItemMock1, pizzaItemMock2],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminOrdersPage,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    orderService = TestBed.inject(OrderService);
    userService = TestBed.inject(UserService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AdminOrdersPage);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    const getOrdersSpy = spyOn(orderService, 'getOrders').and.returnValue(of([
      inProgressOrder, pendingOrder, completedOrder
    ]));

    fixture.detectChanges();

    expect(getOrdersSpy).toHaveBeenCalledTimes(1);
    expect(component.orderInProgress).toBe(inProgressOrder);
    expect(component.ordersQueue.length).toBe(1);
    expect(component.ordersQueue[0]).toBe(pendingOrder);
    expect(component.completedOrders.length).toBe(1);
    expect(component.completedOrders[0]).toBe(completedOrder);
  });

  it('should show alert on loading orders error on init', () => {
    const getOrdersSpy = spyOn(orderService, 'getOrders').and.returnValue(
      throwError(() => 'error')
    );
    const openErrorAlertSpy = spyOn(alertService, 'openErrorAlert').and.stub();

    fixture.detectChanges();

    expect(getOrdersSpy).toHaveBeenCalledTimes(1);
    expect(openErrorAlertSpy).toHaveBeenCalledTimes(1);
  });

  it('should logout and redirect to root', () => {
    const logoutSpy = spyOn(userService, 'logout').and.stub();
    const navigateSpy = spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
    component.logout();

    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/']);
  });

  it('should render the correct number of orders in page', () => {
    const resultOrders = [inProgressOrder, pendingOrder, completedOrder];
    spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));

    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.directive(OrderComponent));
    expect(elements.length).toBe(resultOrders.length);
  });

  it('should call service to set order in progress if no other orders in progress', () => {
    const resultOrders = [pendingOrder];
    spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));
    const setInProgressSpy = spyOn(orderService, 'setOrderInProgress').and.returnValue(of(inProgressOrder));

    fixture.detectChanges();

    const pendingElements = fixture.debugElement.queryAll(By.directive(OrderComponent));
    expect(pendingElements.length).toBe(1);

    const setInProgressButtons = pendingElements[0].queryAll(By.directive(MatButton));
    expect(setInProgressButtons.length).toBe(1);

    setInProgressButtons[0].nativeElement.click();
    expect(setInProgressSpy).toHaveBeenCalledWith(pendingOrder.id);
  });

  it('should not call service to set order in progress if another order is in progress', () => {
    const resultOrders = [inProgressOrder, pendingOrder];
    spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));
    const setInProgressSpy = spyOn(orderService, 'setOrderInProgress').and.stub();

    fixture.detectChanges();

    const pendingElements = fixture.debugElement.queryAll(By.directive(OrderComponent));
    expect(pendingElements.length).toBe(2);

    const setInProgressButtons = pendingElements[1].queryAll(By.directive(MatButton));
    expect(setInProgressButtons.length).toBe(1);

    setInProgressButtons[0].nativeElement.click();
    expect(setInProgressSpy).not.toHaveBeenCalled();
  });

  it('should show error alert if service call to set order in progress fails', () => {
    const resultOrders = [pendingOrder];
    spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));
    const setInProgressSpy = spyOn(orderService, 'setOrderInProgress').and.returnValue(throwError(() => 'error'));
    const openErrorAlertSpy = spyOn(alertService, 'openErrorAlert').and.stub();

    fixture.detectChanges();

    const pendingElements = fixture.debugElement.queryAll(By.directive(OrderComponent));
    expect(pendingElements.length).toBe(1);

    const setInProgressButtons = pendingElements[0].queryAll(By.directive(MatButton));
    expect(setInProgressButtons.length).toBe(1);

    setInProgressButtons[0].nativeElement.click();
    expect(setInProgressSpy).toHaveBeenCalledWith(pendingOrder.id);
    expect(openErrorAlertSpy).toHaveBeenCalledTimes(1);
  });

  it('should call service to set order completed if there one order in progress', () => {
    const resultOrders = [inProgressOrder];
    spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));
    const setOrderCompletedSpy = spyOn(orderService, 'setOrderCompleted').and.returnValue(of(completedOrder));

    fixture.detectChanges();

    const inProgressElements = fixture.debugElement.queryAll(By.directive(OrderComponent));
    expect(inProgressElements.length).toBe(1);

    const setCompletedButtons = inProgressElements[0].queryAll(By.directive(MatButton));
    expect(setCompletedButtons.length).toBe(1);

    setCompletedButtons[0].nativeElement.click();
    expect(setOrderCompletedSpy).toHaveBeenCalledWith(inProgressOrder.id);
  });

  it('should not call service to set order completed if there is no order in progress', () => {
    const resultOrders: Order[] = [];
    spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));
    const setOrderCompletedSpy = spyOn(orderService, 'setOrderCompleted').and.stub();

    fixture.detectChanges();

    const inProgressElements = fixture.debugElement.queryAll(By.directive(OrderComponent));
    expect(inProgressElements.length).toBe(0);

    expect(setOrderCompletedSpy).not.toHaveBeenCalled();
  });

  it('should show error alert if service call to set order completed fails', () => {
    const resultOrders = [inProgressOrder];
    spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));
    const setCompletedSpy = spyOn(orderService, 'setOrderCompleted').and.returnValue(throwError(() => 'error'));
    const openErrorAlertSpy = spyOn(alertService, 'openErrorAlert').and.stub();

    fixture.detectChanges();

    const inProgressElements = fixture.debugElement.queryAll(By.directive(OrderComponent));
    expect(inProgressElements.length).toBe(1);

    const setCompletedButtons = inProgressElements[0].queryAll(By.directive(MatButton));
    expect(setCompletedButtons.length).toBe(1);

    setCompletedButtons[0].nativeElement.click();
    expect(setCompletedSpy).toHaveBeenCalledWith(inProgressOrder.id);
    expect(openErrorAlertSpy).toHaveBeenCalledTimes(1);
  });
});
