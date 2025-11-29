import { TestBed } from '@angular/core/testing';

import { PizzaService } from './pizza.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Pizza } from '../models/pizza.model';
import { provideHttpClient } from '@angular/common/http';
import { API_URL } from '../../environment/environment';

describe('PizzaService', () => {
  let service: PizzaService;
  let httpTestingController: HttpTestingController;

  const mockPizzas: Pizza[] = [
    { id: '1', name: 'Margherita', price: 10 },
    { id: '2', name: 'Pepperoni', price: 12 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PizzaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all pizzas', () => {
    service.getPizzas().subscribe(pizzas => {
      expect(pizzas).toEqual(mockPizzas);
      expect(pizzas.length).toBe(mockPizzas.length);
    });

    const req = httpTestingController.expectOne(`${API_URL}/pizzas`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPizzas);
  });
});
