import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { Order, OrderAction } from '../../models/order.model';
import { By } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  const mockOrder: Order = {
    id: '12345',
    customer: {
      id: '2',
      name: 'Amedeo',
      role: 'customer'
    },
    createdAt: new Date(),
    status: 'in-progress',
    totalPrice: 45.00,
    items: [
      { pizza: { id: '1', name: 'Margherita', price: 10.00 }, quantity: 2 },
      { pizza: { id: '2', name: 'Pepperoni', price: 12.50 }, quantity: 1 }
    ],
  };

  const mockActions: OrderAction[] = [
    {
      label: 'Pay',
      handler: () => { },
      disabled: () => false
    },
    {
      label: 'Close',
      handler: () => { },
      disabled: () => false
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OrderComponent, MatButton]
    }).compileComponents();


    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;

    component.order = mockOrder;
    component.actions = mockActions;

    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getStatus', () => {
    it('should return "Pending" for status "pending"', () => {
      component.order = { ...mockOrder, status: 'pending' };
      expect(component.getStatus()).toBe('Pending');
    });

    it('should return "In progress" for status "in-progress"', () => {
      component.order = { ...mockOrder, status: 'in-progress' };
      expect(component.getStatus()).toBe('In progress');
    });

    it('should return "Completed" for status "completed"', () => {
      component.order = { ...mockOrder, status: 'completed' };
      expect(component.getStatus()).toBe('Completed');
    });
  });

  describe('Template', () => {
    it('should show the order id', () => {
      const element = fixture.debugElement.query(By.css('.order__code')).nativeElement;
      expect(element.textContent).toContain(mockOrder.id);
    })

    it('should show the order status label', () => {
      const element = fixture.debugElement.query(By.directive(MatChip)).nativeElement;
      const statusLabel = component.getStatus();
      expect(element.textContent).toContain(statusLabel);
    });

    it('should show the total price', () => {
      const element = fixture.debugElement.query(By.css('.order__total')).nativeElement;
      expect(element.textContent).toContain(mockOrder.totalPrice);
    });

    it('should show the correct number of order items', () => {
      const elements = fixture.debugElement.queryAll(By.css('.order__item'));
      expect(elements.length).toBe(mockOrder.items.length);
    });

    it('should show the correct number of action buttons', () => {
      const elements = fixture.debugElement.queryAll(By.directive(MatButton));
      expect(elements.length).toBe(mockOrder.items.length);
    });

    it('should not show any action buttons', () => {
      component.actions = [];
      fixture.detectChanges();
      const elements = fixture.debugElement.queryAll(By.directive(MatButton));
      expect(elements.length).toBe(0);
    });
  });

});