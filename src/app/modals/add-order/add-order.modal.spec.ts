import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderModal } from './add-order.modal';
import { OrderService } from '../../services/order.service';
import { PizzaService } from '../../services/pizza.service';
import { AlertService } from '../../services/alert.service';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { Order, OrderItem } from '../../models/order.model';
import { Pizza } from '../../models/pizza.model';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AddOrderModal', () => {
  let component: AddOrderModal;
  let fixture: ComponentFixture<AddOrderModal>;

  let orderService: OrderService;
  let pizzaService: PizzaService;
  let alertService: AlertService;
  let dialogRef: MatDialogRef<AddOrderModal>;

  const customerMock: User = {
    id: '2',
    name: 'Amedeo',
    role: 'customer'
  };

  const pizzas: Pizza[] = [
    { id: '1', name: 'Margherita', price: 10.00 },
    { id: '2', name: 'Pepperoni', price: 12.50 }
  ];

  const pizzaItemMock1: OrderItem = { pizza: pizzas[0], quantity: 2 };
  const pizzaItemMock2: OrderItem = { pizza: pizzas[1], quantity: 1 };

  const pendingOrder: Order = {
    id: '32415',
    customer: customerMock,
    createdAt: new Date(),
    status: 'pending',
    totalPrice: 45.00,
    items: [pizzaItemMock1, pizzaItemMock2],
  };

  let mockDialogRef: {
    close: jasmine.Spy<jasmine.Func>
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      imports: [AddOrderModal],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    orderService = TestBed.inject(OrderService);
    pizzaService = TestBed.inject(PizzaService);
    alertService = TestBed.inject(AlertService);
    dialogRef = TestBed.inject(MatDialogRef);

    fixture = TestBed.createComponent(AddOrderModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load pizzas list on init', () => {
    const getPizzasSpy = spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    fixture.detectChanges();
    expect(getPizzasSpy).toHaveBeenCalledTimes(1);
    expect(component.pizzas.length).toBe(pizzas.length);
    expect(Object.entries(component.selection).length).toBe(component.pizzas.length);
    expect(Object.values(component.selection).some(q => q > 0)).toBeFalse();
  });

  it('should show error alert on load pizza error on init', () => {
    const getPizzasSpy = spyOn(pizzaService, 'getPizzas').and.returnValue(throwError(() => 'error'));
    const openErrorAlertSpy = spyOn(alertService, 'openErrorAlert').and.stub()
    fixture.detectChanges();
    expect(getPizzasSpy).toHaveBeenCalledTimes(1);
    expect(component.pizzas.length).toBe(0);
    expect(openErrorAlertSpy).toHaveBeenCalledTimes(1);
    expect(component.selection).toEqual({});
  });

  it('should not be able to pay when there is no selection', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    fixture.detectChanges();
    expect(Object.values(component.selection).some(q => q > 0)).toBeFalse()
  });

  it('should be able to pay when there is at least one selection', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    fixture.detectChanges();
    component.selection[pizzas[0].id] = 1;
    expect(Object.values(component.selection).some(q => q > 0)).toBeTrue()
  });

  it('should increment selection', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    fixture.detectChanges();
    component.increase(pizzas[0].id);
    expect(component.selection[pizzas[0].id]).toBe(1);
    expect(Object.entries(component.selection)
      .filter(([k, v]) => k !== pizzas[0].id)
      .some(([k, v]) => v > 0)).toBeFalse();
  });

  it('should not decrement selection if quantity is zero', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    fixture.detectChanges();
    component.decrease(pizzas[0].id);
    expect(component.selection[pizzas[0].id]).toBe(0);
  });

  it('should decrement selection if quantity more than zero', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    fixture.detectChanges();
    component.selection[pizzas[0].id] = 2;
    component.decrease(pizzas[0].id);
    expect(component.selection[pizzas[0].id]).toBe(1);
  });

  it('should calculate total cost based on selection', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    fixture.detectChanges();

    component.increase(pizzas[0].id);
    component.increase(pizzas[0].id);
    component.increase(pizzas[1].id);

    const expectedTotal = pizzas[0].price * component.selection[pizzas[0].id]
      + pizzas[1].price * component.selection[pizzas[1].id];
    expect(component.getTotal()).toBe(expectedTotal);
  });

  it('should pay successfully', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    const addOrderSpy = spyOn(orderService, 'addOrder').and.returnValue(of(pendingOrder));
    (dialogRef.close as jasmine.Spy).and.stub();

    fixture.detectChanges();

    component.increase(pizzas[0].id);
    component.increase(pizzas[1].id);

    component.pay();

    expect(addOrderSpy).toHaveBeenCalledTimes(1);
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('should show error alert on pay error', () => {
    spyOn(pizzaService, 'getPizzas').and.returnValue(of(pizzas));
    const addOrderSpy = spyOn(orderService, 'addOrder').and.returnValue(throwError(() => 'error'));
    const openErrorAlertSpy = spyOn(alertService, 'openErrorAlert').and.stub();
    (dialogRef.close as jasmine.Spy).and.stub();

    fixture.detectChanges();

    component.increase(pizzas[0].id);
    component.increase(pizzas[1].id);

    component.pay();

    expect(addOrderSpy).toHaveBeenCalledTimes(1);
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(openErrorAlertSpy).toHaveBeenCalledTimes(1);
  });
});
