import { createStore, withProps, select } from '@ngneat/elf';
import {
  excludeKeys,
  persistState,
  localStorageStrategy,
} from '@ngneat/elf-persist-state';
import { withRequestsStatus } from '@ngneat/elf-requests';

export interface AuthProps {
  jwt: string;
}

export const authStore = createStore(
  { name: 'auth ' },
  withProps<AuthProps>({ jwt: '' }),
  withRequestsStatus()
);

export const persist = persistState(authStore, {
  key: 'auth',
  storage: localStorageStrategy,
  source: () => authStore.pipe(excludeKeys(['requestsStatus'])),
});

export const auth$ = authStore.pipe(select((state) => state));
