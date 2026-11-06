import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(2)
  merchantName!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  merchantSlug!: string;
}
