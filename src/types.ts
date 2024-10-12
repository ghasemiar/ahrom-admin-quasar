import { Ref } from 'vue';

export interface ColumnI {
  name: string;
  label: string;
  align: string;
  field: string;
  sortable: boolean;
}
export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}
export type MaybeRef<T> = Ref<T> | T;
