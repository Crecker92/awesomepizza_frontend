import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrdersPage } from './customer-orders.page';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Order, OrderItem } from '../../models/order.model';
import { User } from '../../models/user.model';
import { of, throwError } from 'rxjs';
import { OrderComponent } from '../../components/order/order.component';
import { By } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddOrderModal } from '../../modals/add-order/add-order.modal';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

describe('CustomerOrdersPage', () => {
  let component: CustomerOrdersPage;
  let fixture: ComponentFixture<CustomerOrdersPage>;

  let orderService: OrderService;
  let userService: UserService;
  let alertService: AlertService;
  let router: Router;
  let dialog: MatDialog;

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

  const dialogRefMock: MatDialogRef<unknown, unknown> = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOrdersPage],
      providers: [
        { provide: MatDialog, useValue: { open: () => dialogRefMock } },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    orderService = TestBed.inject(OrderService);
    userService = TestBed.inject(UserService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);

    fixture = TestBed.createComponent(CustomerOrdersPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    const resultOrders = [inProgressOrder, pendingOrder, completedOrder];
    const getOrdersSpy = spyOn(orderService, 'getOrders').and.returnValue(of(resultOrders));

    fixture.detectChanges();

    expect(getOrdersSpy).toHaveBeenCalledTimes(1);
    expect(component.orders.length).toBe(resultOrders.length);
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

  it('should open add dialog and not reload orders when dialog closed', () => {
    const dialogOpenSpy = spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    const getOrdersSpy = spyOn(orderService, 'getOrders').and.returnValue(of([]));
    (dialogRefMock.afterClosed as jasmine.Spy).and.returnValue(of(undefined));

    fixture.detectChanges();
    component.openAddOrderDialog();

    expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    expect(getOrdersSpy).toHaveBeenCalledTimes(1);
  });

  it('should open add dialog and reload orders when dialog closed and order added', () => {
    const dialogOpenSpy = spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    const getOrdersSpy = spyOn(orderService, 'getOrders').and.returnValue(of([]));
    (dialogRefMock.afterClosed as jasmine.Spy).and.returnValue(of('added'));

    fixture.detectChanges();
    component.openAddOrderDialog();

    expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    expect(getOrdersSpy).toHaveBeenCalledTimes(2);
  });
});
