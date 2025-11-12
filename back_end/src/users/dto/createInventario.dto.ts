import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createInventarioDto{

    @IsNumber()
    @IsNotEmpty()
    cantidad: number
    
    @IsNumber()
    @IsNotEmpty()
    ultimaCantidad: number

}