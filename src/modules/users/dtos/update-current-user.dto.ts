import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateCurrentUserDTO {
  @Expose()
  @ValidateIf((obj, value) => value)
  @IsNotEmpty({ message: 'First name cannot be null' })
  @MinLength(2, { message: 'First name at least 2 characters' })
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsString({ message: 'Photo must be a string' })
  photo?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsPhoneNumber('VN', { message: 'Invalid Phone number' })
  @IsString({ message: 'Photo must be a string' })
  phoneNumber?: string;
}
