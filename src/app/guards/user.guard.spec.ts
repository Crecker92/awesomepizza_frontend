import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { userGuard } from './user.guard';

describe('userGuard', () => {
  const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => userGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true', () => {
    const storageSpy = spyOn(localStorage, 'getItem').and.returnValue('1');
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeTrue();
    expect(storageSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false for null value', () => {
    const storageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(storageSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false for empty string', () => {
    const storageSpy = spyOn(localStorage, 'getItem').and.returnValue('');
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(storageSpy).toHaveBeenCalledTimes(1);
  });
});
