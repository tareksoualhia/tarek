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
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then((c) => c.ProductsComponent)
      },
      {
        path: 'addproducts',
        loadComponent: () => import('./pages/add-product/add-product.component').then((c) => c.AddProductComponent)
      },
       {
        path: 'update-product/:id',
        loadComponent: () => import('./pages/update-product/update-product.component').then((c) => c.UpdateProductComponent)
      },
       {
        path: 'contrats',
        loadComponent: () => import('./pages/contrats/contrats.component').then((c) => c.ContratsComponent)
      },
      {
        path: 'addcontrats',
        loadComponent: () => import('./pages/add-contrats/add-contrats.component').then((c) => c.AddContratsComponent)
      },
       
      {
        path: 'contrats/update/:id',
        loadComponent: () => import('./pages/update-contrats/update-contrats.component').then((c) => c.UpdateContratsComponent)
      },
        {
        path: 'factures',
        loadComponent: () => import('./pages/factures/factures.component').then((c) => c.FacturesComponent)
      }, {
        path: 'reclamations',
        loadComponent: () => import('./pages/reclamations/reclamations.component').then((c) => c.ReclamationsComponent)
      },
      {
        path: 'videos',
        loadComponent: () => import('./pages/admin-video-call/admin-video-call.component').then((c) => c.AdminVideoCallComponent)
      },
         {
        path: 'addfactures',
        loadComponent: () => import('./pages/add-facture/add-facture.component').then((c) => c.AddFactureComponent)
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
