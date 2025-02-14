import { Transform } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(7)
  @Transform(({ value }) => value.trim())
  password: string;
}
