import { trigger, transition, animate, style } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { updateEntities, deleteEntities } from '@ngneat/elf-entities';
import { BasketProduct, basketStore } from 'src/data-access';

@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss'],
})
export class CartProductComponent {
  @Input() product?: BasketProduct;

  public upInput(event: any, product: BasketProduct) {
    const amount = Number(event.target.value);

    if (amount >= 101) {
      amount == 100;
    } else {
      basketStore.update(
        updateEntities(product.ean, {
          amount,
          totalPrice: product.price * amount,
        })
      );
    }
  }

  public changeAmount(product: BasketProduct, amount: number) {
    const newAmount = product.amount + amount;
    if (product.amount <= 0 || newAmount == 0) {
      this.deleteProduct();
    } else if (newAmount >= 101 || product.amount >= 101) {
      product.amount == 100;
    } else {
      basketStore.update(
        updateEntities(product.ean, {
          amount: newAmount,
          totalPrice: product.price * newAmount,
        })
      );
    }
  }

  public deleteProduct() {
    if (!this.product) return;
    basketStore.update(deleteEntities(this.product.ean));
  }
}
