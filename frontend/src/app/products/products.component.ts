import { Component, OnInit } from '@angular/core';
import { ProductService, productStore } from 'src/data-access/products';
import { selectAllEntities } from '@ngneat/elf-entities';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterRepository } from '@ngneat/elf-ng-router-store';
import { interval, map, of, Subject, takeUntil, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { selectRequestStatus } from '@ngneat/elf-requests';
import { CategoryStore } from 'src/data-access/categories/category.store';
import { CategoryService } from 'src/data-access';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products$ = productStore.pipe(selectAllEntities());
  categoryParam$ = this.routerRepository.selectQueryParams();
  categories$ = CategoryStore.pipe(selectAllEntities());
  isLoading$ = productStore.pipe(
    selectRequestStatus('product'),
    map((status) => status.value === 'pending')
  );
  destroy$ = new Subject<void>();
  filterForm: FormGroup;
  page = 1;
  height = 50;

  constructor(
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private fb: FormBuilder,
    private routerRepository: RouterRepository
  ) {
    this.filterForm = this.fb.group({
      categories: '-1',
      height: '50',
    });
  }

  ngOnInit() {
    this.handleParams();
    this.formChange();
    this.CategoryService.getCategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleParams() {
    this.categoryParam$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.page = 1;
        const categoryId = params.category;
        this.filterForm.get('categories')?.setValue(categoryId ?? '-1');
        this.ProductService.getProducts(this.page, categoryId);
      });
  }

  private formChange() {
    this.page = 1;

    this.filterForm.valueChanges.subscribe(({ categories, height }) => {
      const categoryId = categories === '-1' ? undefined : categories;
      const example = of(height);

      const debounceTimer = example.pipe(debounce(() => timer(1000)));
      const subscribe = debounceTimer.subscribe((val) => {
        this.ProductService.getProducts(this.page, categoryId);
      });
    });
  }

  public onScroll() {
    this.page += 1;
    const categories = this.filterForm.get('categories')?.value;
    const categoryId = categories === '-1' ? undefined : categories;
    this.ProductService.getProducts(this.page, categoryId);
  }
}
