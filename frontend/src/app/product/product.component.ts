import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Subject, withLatestFrom } from 'rxjs';
import { ProductService, productStore } from 'src/data-access';
import {
  BasketProduct,
  basketStore,
} from 'src/data-access/products/basket.store';
import {
  resetActiveId,
  selectActiveEntity,
  selectAllEntities,
  upsertEntities,
  deleteEntities,
  selectEntity,
  getActiveId,
} from '@ngneat/elf-entities';
import { RouterRepository } from '@ngneat/elf-ng-router-store';
import { trigger, transition, animate, style } from '@angular/animations';
import { ProductSuppliers } from 'src/models';

@Component({
  selector: 'app-product§',
  animations: [
    trigger('addToCart', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  destroy$ = new Subject<void>();

  addToBasket$ = new Subject<void>();

  product$ = productStore.pipe(
    selectActiveEntity(),
    filter((product) => product !== undefined)
  );

  price$ = this.product$.pipe(
    map(
      (product) =>
        product?.suppliers.find(
          (supplier: ProductSuppliers) =>
            supplier.key == product.mainSupplierKey
        )?.sellingPrice || 0
    )
  );

  basketProduct$ = basketStore.pipe(selectAllEntities()).pipe(
    withLatestFrom(this.product$),
    map(([basket, product]) => {
      return basket.find((basket) => basket.ean == product?.ean);
    })
  );

  constructor(
    private ProductService: ProductService,
    private routerRepository: RouterRepository,
    private router: Router
  ) {
    this.handleAddToBasket();
  }

  ngOnInit() {
    const id = this.routerRepository.getParams('id');
    if (id) {
      this.ProductService.getProduct(id);
    } else {
      this.router.navigate(['/error']);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    productStore.update(resetActiveId());
  }

  public handleAddToBasket() {
    this.addToBasket$
      .pipe(
        withLatestFrom(
          this.product$,
          basketStore.pipe(selectEntity(productStore.query(getActiveId))),
          this.price$
        )
      )
      .subscribe(([, product, BasketProduct, price]) => {
        const amount = (BasketProduct?.amount ?? 0) + 1;
        if (amount >= 101) {
          amount == 100;
        } else {
          basketStore.update(
            upsertEntities({
              ...product,
              price: price,
              amount: amount,
              totalPrice: price * amount,
            })
          );
        }
      });
  }

  public updateInput(event: any, product: BasketProduct) {
    this.changeAmount(product, Number(event.target.value));
  }

  public changeAmount(product: BasketProduct, amount: number) {
    if (amount <= 0) {
      basketStore.update(deleteEntities(product.ean));
    } else if (amount >= 101 || product.amount >= 101) {
      amount == 100;
    } else {
      basketStore.update(
        upsertEntities({
          ...product,
          amount: amount,
          totalPrice: product.price * amount,
        })
      );
    }
  }
}
