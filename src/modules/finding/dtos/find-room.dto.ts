import { IsArray, IsInt, IsString, ValidateIf } from "class-validator";

export class FindRoomDTO {
    @ValidateIf((obj, value) => value)
    @IsString()
    keyword?: string;

    @ValidateIf((obj, value) => value)
    @IsString()
    district?: string;

    @ValidateIf((obj, value) => value)
    @IsString()
    city?: string;

    @ValidateIf((obj, value) => value)
    @IsInt()
    maxPrice?: number;

    @ValidateIf((obj, value) => value)
    @IsInt()
    minPrice?: number = 0;

    @ValidateIf((obj, value) => value)
    @IsArray()
    @IsInt({each: true})
    utilities?: number[];
}