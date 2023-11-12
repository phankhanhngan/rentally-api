import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
@Exclude()
export class RatingDTO {
  @ApiProperty()
  @Expose()
  comment?: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  rentalId!: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  cleanRate!: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  supportRate!: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  locationRate!: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  securityRate!: number;
}
