import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/data-access';
import { user$ as storeUser$ } from 'src/data-access/accounts/user.store';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.scss'],
})
export class BottomComponent implements OnInit {
  constructor(private accountService: AccountService) {}
  user$ = storeUser$;

  ngOnInit(): void {}
}
