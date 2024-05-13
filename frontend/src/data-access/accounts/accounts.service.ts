import { Injectable } from '@angular/core';
import { updateRequestStatus } from '@ngneat/elf-requests';
import { Apollo } from 'apollo-angular';
import { authStore } from './account.store';
import { getMeQuery } from './graphql';
import { catchError } from 'rxjs/operators';
import { loginMutation } from './graphql/accounts.gql-mutation';
import { userStore } from './user.store';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AccountService {
  constructor(private apollo: Apollo, private router: Router) {}

  login(email: string, password: string): void {
    authStore.update(updateRequestStatus('auth', 'pending'));

    this.apollo
      .mutate({
        mutation: loginMutation,
        variables: { email, password },
      })
      .subscribe({
        next: (result: any) => {
          authStore.update(
            (state) => ({
              ...state,
              jwt: result.data.login.jwt,
            }),
            updateRequestStatus('auth', 'success')
          );

          userStore.update(() => ({
            username: result.data.login.user.username,
            email: result.data.login.user.email,
          }));
        },
        error: (error: any) => {
          authStore.update(
            updateRequestStatus('auth', 'error', 'invalid login')
          );
        },
      });
  }

  getMe() {
    this.apollo
      .query({
        query: getMeQuery,
      })
      .pipe(
        catchError((err) => {
          return this.handleError(err);
        })
      )
      .subscribe((result: any) => {
        userStore.update(() => ({
          username: result.data.me.username,
          email: result.data.me.email,
        }));
      });
  }

  logout() {
    authStore.reset();
    userStore.reset();
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }

  handleError(error: any) {
    if (error.networkError.status === 401) {
      this.logout();
    }
    return of(null);
  }
}
