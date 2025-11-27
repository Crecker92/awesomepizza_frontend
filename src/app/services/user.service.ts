import { Injectable } from '@angular/core';
import { UserRole } from '../models/user.model';

const LS_KEY = 'userId';
const ADMIN_ID = '1';
const CUSTOMER_ID = '2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  login(role: UserRole) {
    const id = role === 'admin' ? ADMIN_ID : CUSTOMER_ID;
    localStorage.setItem(LS_KEY, id);
  }

  logout() {
    localStorage.removeItem(LS_KEY);
  }

  isAdmin() {
    return localStorage.getItem(LS_KEY) === ADMIN_ID;
  }

  isCustomer() {
    return localStorage.getItem(LS_KEY) === CUSTOMER_ID;
  }

  getUserId() {
    return localStorage.getItem(LS_KEY);
  }
}
