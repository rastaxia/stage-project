import { Component, Input } from '@angular/core';
import { Product } from 'src/models';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product?: Product;

  get price(): number | undefined {
    return (
      this.product?.suppliers.find(
        (supplier) => supplier.key == this.product?.mainSupplierKey
      )?.sellingPrice || 0
    );
  }
}
