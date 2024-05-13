import { Component } from '@angular/core';
import { selectAllEntities } from '@ngneat/elf-entities';
import { map, Subject } from 'rxjs';
import { BasketProduct, basketStore } from 'src/data-access';

@Component({
  selector: 'app-bestel-page',
  templateUrl: './bestel-page.component.html',
  styleUrls: ['./bestel-page.component.scss'],
})
export class BestelPageComponent {
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

  constructor() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  order() {}
}
