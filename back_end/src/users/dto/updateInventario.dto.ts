import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updateInventarioDto{

    @IsNumber()
    @IsOptional()
    cantidad?: number
    
    @IsNumber()
    @IsOptional()
    ultimaCantidad?: number

    
    updatedAt?: Date
}