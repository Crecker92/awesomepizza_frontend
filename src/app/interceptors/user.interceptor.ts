import { HttpInterceptorFn } from '@angular/common/http';
import { USER_HEADER } from '../../environment/environment';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const userId = userService.getUserId();
  const finalReq = userId ? req.clone({
    setHeaders: { [USER_HEADER]: userId }
  }) : req;
  return next(finalReq);
};
