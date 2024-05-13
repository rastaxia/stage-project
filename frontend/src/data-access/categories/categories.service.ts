import { Injectable } from '@angular/core';
import axios from 'axios';
import { catchError, from, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../accounts';
import { CategoryStore } from './category.store';
import { upsertEntities } from '@ngneat/elf-entities';

@Injectable()
export class CategoryService {
  constructor(private accountService: AccountService) {}
  getCategories() {
    const url = new URL(`$categories`);
    from(axios.get(url.href))
      .pipe(
        catchError((err) => {
          return this.accountService.handleError(err);
        }),
        map((result: any) =>
          result.data.map((category: any) => ({
            name: category.name,
            code: category.code,
            parentCategory: category.parentCategory,
            properties: [category.properties],
          }))
        )
      )
      .subscribe((category) => {
        CategoryStore.update(upsertEntities(category));
      });
  }
}
