import { TestBed } from '@angular/core/testing';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { userInterceptor } from './user.interceptor';
import { UserService } from '../services/user.service';
import { USER_HEADER } from '../../environment/environment';
import { Observable } from 'rxjs';

describe('userInterceptor', () => {
  let userService: UserService;
  const mockReq = new HttpRequest<unknown>('GET', '/test');
  const mockNext: HttpHandlerFn = () => {
    return new Observable(subscriber => subscriber.complete());
  };

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => userInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should set x-user header to the user id value', () => {
    const userIdSpy = spyOn(userService, 'getUserId').and.returnValue('1');
    const reqCloneSpy = spyOn(mockReq, 'clone').and.stub();

    interceptor(mockReq, mockNext);

    expect(userIdSpy).toHaveBeenCalledTimes(1);
    expect(reqCloneSpy).toHaveBeenCalledOnceWith({
      setHeaders: { [USER_HEADER]: '1' }
    });
  });

  it('should not set x-user header for invalid user id', () => {
    const userIdSpy = spyOn(userService, 'getUserId').and.returnValue(null);
    const reqCloneSpy = spyOn(mockReq, 'clone').and.stub();

    interceptor(mockReq, mockNext);

    expect(userIdSpy).toHaveBeenCalledTimes(1);
    expect(reqCloneSpy).not.toHaveBeenCalled();
  });

  it('should not set x-user header for empty string user id', () => {
    const userIdSpy = spyOn(userService, 'getUserId').and.returnValue('');
    const reqCloneSpy = spyOn(mockReq, 'clone').and.stub();

    interceptor(mockReq, mockNext);

    expect(userIdSpy).toHaveBeenCalledTimes(1);
    expect(reqCloneSpy).not.toHaveBeenCalled();
  });
});
