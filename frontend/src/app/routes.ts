import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { LoginComponent } from './login/login.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { ProductsComponent } from './products/products.component';
import { isLoggedIn } from './routing-guards.guard';
import { BestelPageComponent } from './bestel-page/bestel-page.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    canActivate: [isLoggedIn],
    children: [
      { path: '', component: ProductsComponent },
      { path: ':id', component: ProductComponent },
    ],
  },

  { path: 'cart', component: CartComponent, canActivate: [isLoggedIn] },
  {
    path: 'bestelling',
    component: BestelPageComponent,
    canActivate: [isLoggedIn],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'error',
    component: NotFoundPageComponent,
    canActivate: [isLoggedIn],
  },
];
