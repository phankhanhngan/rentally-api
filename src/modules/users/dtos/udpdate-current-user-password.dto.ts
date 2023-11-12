import { IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateCurrentUserPasswordDTO {
  @ValidateIf((obj, value) => value)
  @MinLength(2, { message: 'Password at least 2 characters' })
  @IsString({ message: 'password must be a string' })
  currentPassword?: string;

  @ValidateIf((obj, value) => value)
  @MinLength(2, { message: 'Password at least 2 characters' })
  @IsString({ message: 'password must be a string' })
  newPassword?: string;
}
