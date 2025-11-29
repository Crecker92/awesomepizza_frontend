import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set admin id to local storage', () => {
    const setItemSpy = spyOn(localStorage, 'setItem').and.stub();
    service.login('admin');
    expect(setItemSpy).toHaveBeenCalledOnceWith('userId', '1');
  });

  it('should set customer id to local storage', () => {
    const setItemSpy = spyOn(localStorage, 'setItem').and.stub();
    service.login('customer');
    expect(setItemSpy).toHaveBeenCalledOnceWith('userId', '2');
  });

  it('should remove user id from local storage', () => {
    const spy = spyOn(localStorage, 'removeItem').and.stub();
    service.logout();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should verify that user is admin', () => {
    spyOn(localStorage, 'getItem').and.returnValue('1');
    const result = service.isAdmin();
    expect(result).toBeTrue();
  });

  it('should verify that user is not admin', () => {
    spyOn(localStorage, 'getItem').and.returnValue('2');
    const result = service.isAdmin();
    expect(result).toBeFalse();
  });

  it('should verify that user is customer', () => {
    spyOn(localStorage, 'getItem').and.returnValue('2');
    const result = service.isCustomer();
    expect(result).toBeTrue();
  });

  it('should verify that user is not customer', () => {
    spyOn(localStorage, 'getItem').and.returnValue('1');
    const result = service.isCustomer();
    expect(result).toBeFalse();
  });
});
