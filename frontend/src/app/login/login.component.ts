import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, filter, from, tap } from 'rxjs';
import { AccountService } from 'src/data-access';
import { auth$, authStore } from 'src/data-access/accounts/account.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectRequestStatus } from '@ngneat/elf-requests';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  status$ = authStore.pipe(
    selectRequestStatus('auth'),
    filter((status) => status && status.value === 'error')
  );
  loginForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    auth$
      .pipe(
        filter(({ jwt }) => {
          return jwt.trim().length > 0;
        }),
        first()
      )
      .subscribe(() => {
        this.router.navigate(['/products']);
      });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public signIn() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    this.accountService.login(email, password);
    auth$
      .pipe(
        filter(({ jwt }) => {
          return jwt.trim().length > 0;
        }),
        first()
      )
      .subscribe(() => {
        this.router.navigate(['/products']);
      });
  }
}
