import { createStore } from '@ngneat/elf';
import {
  getAllEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { ProductCategory } from 'src/models';

export const CategoryStoreName = 'category';
export const CategoryStore = createStore(
  { name: CategoryStoreName },
  withEntities<ProductCategory, 'code'>({ idKey: 'code' }),
  withActiveId()
);

export const categories$ = CategoryStore.query(getAllEntities());
