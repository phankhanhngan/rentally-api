import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Point } from 'src/entities';

@ValidatorConstraint({ name: 'customPoint', async: false })
export class CustomPointValidation implements ValidatorConstraintInterface {
  validate(point: Point, args: ValidationArguments) {
    return this.isNumber(point.latitude) && this.isNumber(point.longitude);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'latitude and longitude must be decimal';
  }

  isNumber(value?: string | number): boolean {
    return value != null && value !== '' && !isNaN(Number(value.toString()));
  }
}
