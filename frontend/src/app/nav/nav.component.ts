import { Component, OnInit } from '@angular/core';
import { selectAllEntities } from '@ngneat/elf-entities';
import { filter, map } from 'rxjs';
import { AccountService, BasketProduct, basketStore } from 'src/data-access';
import { user$ as storeUser$ } from 'src/data-access/accounts/user.store';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  constructor(private accountService: AccountService) {}
  user$ = storeUser$;

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

  public logout() {
    this.accountService.logout();
  }
}
