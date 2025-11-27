import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrdersPage } from './customer-orders.page';

describe('CustomerOrdersPage', () => {
  let component: CustomerOrdersPage;
  let fixture: ComponentFixture<CustomerOrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOrdersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
