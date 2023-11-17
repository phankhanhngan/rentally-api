import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PaymentInformationDTO {
    // Payment Information
    roomPrice: bigint;
    @ApiProperty()
    @Expose()
    electricNumber: number;
    @ApiProperty()
    @Expose()
    totalElectricPrice: number;
    @ApiProperty()
    @Expose()
    waterNumber: number;
    @ApiProperty()
    @Expose()
    totalWaterPrice: number;
    @ApiProperty()
    @Expose()
    additionalPrice: number;
    @ApiProperty()
    @Expose()
    totalPrice: number;
    @ApiProperty()
    @Expose()
    month: number;    
    @ApiProperty()
    @Expose()
    year: number;
}