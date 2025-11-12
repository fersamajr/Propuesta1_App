import { IsDate, IsIn, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updatePagoDto{
    @IsOptional()
    @IsDate()
    fecha?: Date
    
    @IsNumber()
    @IsOptional()
    cantidad?: number;
}