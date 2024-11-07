import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if ( localStorage.getItem('token') !== null ) {
    const token = localStorage.getItem('token') ?? '';
    req = req.clone({
      setHeaders: {
        Authorization: token ? token : '',
      },
    });
  }
  return next(req);
};
