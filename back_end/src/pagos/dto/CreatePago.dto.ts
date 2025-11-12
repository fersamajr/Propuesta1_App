import { IsDate, IsIn, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createPagoDto{
    @IsNotEmpty()
    @IsDate()
    fecha: Date
    
    @IsNumber()
    @IsNotEmpty()
    cantidad: number;
}