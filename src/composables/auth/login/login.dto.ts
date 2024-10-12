import { Expose, Type } from 'class-transformer';
export class LoginDto {
  @Expose()
  msg: string;
  @Expose()
  token: string;
}
