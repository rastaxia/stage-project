import { Component, OnInit } from '@angular/core';
import { filter, first, Subscription } from 'rxjs';
import { AccountService } from 'src/data-access';
import { auth$ } from 'src/data-access/accounts/account.store';
import { Product } from 'src/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Greencloud';
  products: Product[] = [];

  private queryProducts: Subscription = new Subscription();

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.handleAuth();
  }

  ngOnDestroy() {
    this.queryProducts.unsubscribe();
  }

  private handleAuth() {
    auth$
      .pipe(
        first(),
        filter((user) => {
          return user.jwt.trim().length > 0;
        })
      )
      .subscribe((user) => {
        this.accountService.getMe();
      });
  }
}
