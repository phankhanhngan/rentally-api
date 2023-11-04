import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCoordinateFormat', async: false })
export class IsCoordinateFormat implements ValidatorConstraintInterface {
  validate(coordinate: any, args: ValidationArguments) {
    if (
      typeof coordinate === 'object' &&
      coordinate !== null &&
      'latitude' in coordinate &&
      'longitude' in coordinate
    ) {
      // Kiểm tra rằng cả latitude và longitude là số thực
      return (
        typeof coordinate.latitude === 'number' &&
        typeof coordinate.longitude === 'number'
      );
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return "Coordinate must have 'latitude' and 'longitude' properties, and they must be floating-point numbers.";
  }
}
