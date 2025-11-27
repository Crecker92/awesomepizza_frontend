import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pizza } from '../models/pizza.model';
import { API_URL } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  constructor(
    private http: HttpClient
  ) { }

  getPizzas() {
    return this.http.get<Pizza[]>(`${API_URL}/pizzas`);
  }

}
