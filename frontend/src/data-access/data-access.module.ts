import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from './accounts';
import { ProductService } from './products';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { setContext } from '@apollo/client/link/context';
import { environment } from 'src/environments/environment';
import { devTools } from '@ngneat/elf-devtools';
import { CategoryService } from './categories';

devTools();

export function createApollo(httpLink: HttpLink) {
  const auth = setContext(() => {
    const authStorage = localStorage.getItem('auth');
    const token = authStorage ? JSON.parse(authStorage).jwt : null;

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  });

  const link = ApolloLink.from([
    auth,
    httpLink.create({ uri: environment.graphQlApiUrl }),
  ]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  imports: [CommonModule, ApolloModule],
  providers: [
    AccountService,
    ProductService,
    CategoryService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class DataAccessModule {}
