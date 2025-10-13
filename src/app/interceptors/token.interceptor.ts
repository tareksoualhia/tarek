import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  // Ne pas attacher le token pour la route de login
  if (req.url.includes('/adminlogin')) {
    return next(req);
  }

  const token = localStorage.getItem('access');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('🔐 Token attached to:', cloned.url);
    return next(cloned);
  }

  return next(req);
};
