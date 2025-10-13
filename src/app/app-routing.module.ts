// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/component/basic-component/typography/typography.component').then((c) => c.TypographyComponent)
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'mes-informations',
        loadComponent: () => import('./pages/client-profile/client-profile.component').then(m => m.ClientProfileComponent)
      },
      {
        path: 'contrats',
        loadComponent: () => import('./pages/contrats/contrats.component').then(m => m.ContratsComponent)
      },
      {
        path: 'facture',
        loadComponent: () => import('./pages/facture/facture.component').then(m => m.FactureComponent)
      },
       {
        path: 'reclamations',
        loadComponent: () => import('./pages/reclamations/reclamations.component').then(m => m.ReclamationsComponent)
      },
       {
        path: 'addreclamation',
        loadComponent: () => import('./pages/reclamations-add/reclamations-add.component').then(m => m.ReclamationsAddComponent)
      },
      {
        path: 'videos',
        loadComponent: () => import('./pages/client-video-call/client-video-call.component').then((c) => c.ClientVideoCallComponent)
      },
     {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then((c) => c.ProductsComponent)
      },
     {
        path: 'panier',
        loadComponent: () => import('./pages/panier/panier.component').then((c) => c.PanierComponent)
      },
      {
        path: 'updateprofile',
        loadComponent: () => import('./pages/update-profile/update-profile.component').then(m => m.UpdateProfileComponent)
      },
    
      
      
    ]
  },
 
  
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      },
       {
        path: 'forgotpassword',
        loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
     { 
  path: 'resetpassword/:id/:token',
  loadComponent: () => import('./pages/reset-password/reset-password.component')
    .then(m => m.ResetPasswordComponent),
}
    ]
  }
,
  {
    path: 'signup',
    loadComponent: () => import('../app/signup/signup.component').then(m => m.SignupComponent)
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export { routes };
