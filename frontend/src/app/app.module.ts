import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ProductsComponent } from './products/products.component';
import { RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { BottomComponent } from './bottom/bottom.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { DataAccessModule } from 'src/data-access/data-access.module';
import { ElfNgRouterStoreModule } from '@ngneat/elf-ng-router-store';
import { appRoutes } from './routes';
import { ProductCardComponent } from './product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { BestelPageComponent } from './bestel-page/bestel-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartProductComponent } from './cart/cart-product/cart-product.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
    }),
    BrowserModule,
    HttpClientModule,
    DataAccessModule,
    FormsModule,
    ElfNgRouterStoreModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
  ],
  declarations: [
    AppComponent,
    NavComponent,
    ProductsComponent,
    ProductComponent,
    BottomComponent,
    CartComponent,
    LoginComponent,
    ProductCardComponent,
    NotFoundPageComponent,
    BestelPageComponent,
    CartProductComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
