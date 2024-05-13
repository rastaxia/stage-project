import { createStore } from '@ngneat/elf';
import {
  getAllEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { withRequestsStatus } from '@ngneat/elf-requests';
import { Product } from 'src/models';

export const ProductStoreName = 'product';
export const productStore = createStore(
  { name: ProductStoreName },
  withEntities<Product, 'ean'>({ idKey: 'ean' }),
  withActiveId(),
  withRequestsStatus()
);

export const products$ = productStore.query(getAllEntities());
