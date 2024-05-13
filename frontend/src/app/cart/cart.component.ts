import { Component } from '@angular/core';
import { selectAllEntities } from '@ngneat/elf-entities';
import {
  BasketProduct,
  basketStore,
} from 'src/data-access/products/basket.store';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  products$ = basketStore.pipe(selectAllEntities());

  totalAmount$ = basketStore.pipe(
    selectAllEntities(),
    map((basketProducts) => {
      const totalAmount = basketProducts.reduce(
        (prev: number, cur: BasketProduct) => prev + cur.amount,
        0
      );
      return totalAmount;
    })
  );

  totalPrice$ = basketStore.pipe(
    selectAllEntities(),
    map((basketProducts) => {
      const totalPrice = basketProducts.reduce(
        (prev: number, cur: BasketProduct) => prev + cur.amount * cur.price,
        0
      );

      return totalPrice;
    })
  );

  destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
