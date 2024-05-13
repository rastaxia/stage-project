import { createStore } from '@ngneat/elf';
import { selectEntities, withEntities } from '@ngneat/elf-entities';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { ProductCategory, ProductProperties } from 'src/models';

export interface BasketProduct {
  ean: string;
  displayName: string;
  amount: number;
  price: number;
  images: string;
  totalPrice: number;
}

export const basketStore = createStore(
  { name: 'basket' },
  withEntities<BasketProduct, 'ean'>({ idKey: 'ean' })
);

export const persist = persistState(basketStore, {
  key: 'basket',
  storage: localStorageStrategy,
});

export const basket$ = basketStore.pipe(selectEntities());
