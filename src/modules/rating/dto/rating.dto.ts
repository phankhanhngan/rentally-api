import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
@Exclude()
export class RatingDTO {
  @Expose()
  comment?: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  rentalId!: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  cleanRate!: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  supportRate!: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  locationRate!: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  securityRate!: number;
}
