import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { setActiveId, upsertEntities } from '@ngneat/elf-entities';
import { updateRequestStatus } from '@ngneat/elf-requests';
import { Apollo } from 'apollo-angular';
import axios from 'axios';
import { catchError, map, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from 'src/models';
import { AccountService } from '../accounts';
import { getProductQuery } from './graphql/products.gql-query';

import { productStore, ProductStoreName } from './product.store';

@Injectable()
export class ProductService {
  constructor(
    private apollo: Apollo,
    private accountService: AccountService,
    private router: Router
  ) {}

  getProducts(page: number = 1, categoryId?: string, height?: string): void {
    if (page === 1) {
      productStore.reset();
    }

    const url = new URL(`${environment.apiUrl}/products`);
    url.searchParams.append('page', page.toString());
    if (!!categoryId) {
      url.searchParams.append('category', categoryId);
    }

    productStore.update(updateRequestStatus(ProductStoreName, 'pending'));
    from(axios.get(url.href))
      .pipe(
        catchError((err) => {
          return this.accountService.handleError(err);
        }),
        map((result: any) =>
          result.data.map((product: any) => ({
            ean: product.ean,
            name: product.name,
            displayName: product.displayName,
            categoryCode: product.categoryCode,
            mainSupplierKey: product.mainSupplierKey,
            suppliers:
              product.suppliers && product.suppliers.length > 0
                ? product.suppliers.map((s: any) => ({
                    sellingPrice: s.sellingPrice == -1 ? 0 : s.sellingPrice,
                    key: s.key,
                  }))
                : [],
            properties: product.properties,
            category: {
              code: product.category.code,
              name: product.category.name,
            },
            tags: product.tags,
            // images: products.images.url,
          }))
        )
      )
      .subscribe((products: Product[]) => {
        productStore.update(upsertEntities(products));
        productStore.update(updateRequestStatus(ProductStoreName, 'success'));
      });
  }

  getProduct(id: string): void {
    from(axios.get(`${environment.apiUrl}/product?ean=${id}`))
      .pipe(
        catchError((err) => {
          return this.accountService.handleError(err);
        }),
        map((result: any): Product | undefined => {
          const product = result.data;
          if (product) {
            return {
              ean: product.ean,
              name: product.name,
              displayName: product.displayName,
              categoryCode: product.categoryCode,
              mainSupplierKey: product.mainSupplierKey,
              suppliers:
                product.suppliers && product.suppliers.length > 0
                  ? product.suppliers.map((s: any) => ({
                      sellingPrice: s.sellingPrice == -1 ? 0 : s.sellingPrice,
                      key: s.key,
                    }))
                  : [],
              properties: product.properties,
              category: {
                code: product.category.code,
                name: product.category.name,
              },
              tags: product.tags,
              // images: products.images.url,
            };
          } else return undefined;
        })
      )
      .subscribe((product) => {
        if (product !== undefined) {
          productStore.update(
            upsertEntities(product),
            setActiveId(product.ean)
          );
        } else {
          this.router.navigate(['/error']);
        }
      });
  }
}
