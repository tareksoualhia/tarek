import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app-routing.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          // 👉 NE PAS ajouter de token si c’est une requête vers /adminLogin
          if (req.url.includes('/adminLogin')) {
            console.log('🚫 Skip token for login:', req.url);
            return next(req);
          }

          const token = localStorage.getItem('access');
          if (token) {
            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            console.log('🔐 Token attached:', cloned.url);
            return next(cloned);
          }

          return next(req);
        }
      ])
    )
  ]
};
