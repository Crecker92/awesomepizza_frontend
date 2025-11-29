import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { customerGuard } from './customer.guard';
import { UserService } from '../services/user.service';

describe('customerGuard', () => {
  let userService: UserService;
  let router: Router;
  const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => customerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true', () => {
    const isCustomerSpy = spyOn(userService, 'isCustomer').and.returnValue(true);
    const createUrlTrySpy = spyOn(router, 'createUrlTree').and.stub();

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBeTrue();
    expect(isCustomerSpy).toHaveBeenCalledTimes(1);
    expect(createUrlTrySpy).not.toHaveBeenCalled();
  });

  it('should redirect to root', () => {
    const isCustomerSpy = spyOn(userService, 'isCustomer').and.returnValue(false);
    const createUrlTrySpy = spyOn(router, 'createUrlTree').and.stub();

    const result = executeGuard(mockRoute, mockState);

    expect(isCustomerSpy).toHaveBeenCalledTimes(1);
    expect(createUrlTrySpy).toHaveBeenCalledOnceWith(['/']);
  });
});
