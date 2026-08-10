import { Type } from 'class-transformer';
import { Min, IsInt } from 'class-validator';

export class DirectCheckoutDto {
    @Type(() => Number) @IsInt() @Min(1) productId!: number;
    @Type(() => Number) @IsInt() @Min(1) quantity!: number;
}