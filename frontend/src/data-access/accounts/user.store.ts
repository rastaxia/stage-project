import { createStore, withProps, select } from '@ngneat/elf';

export interface UserProps {
  email: string;
  username: string;
}

export const userStore = createStore(
  { name: 'user ' },
  withProps<UserProps>({ email: '', username: '' })
);

export const user$ = userStore.pipe(select((state) => state));
