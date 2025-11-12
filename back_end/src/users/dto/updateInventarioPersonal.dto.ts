import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updateInventarioPersonalDto{
    @IsString()
    @IsOptional()
    @MinLength(3)
    producto?: string

    @IsNumber()
    @IsOptional()
    cantidad? : number

    @MinLength(3)
    @IsOptional()
    cantidadAnterior?: number

    @IsOptional()
    fechaAnterior?: Date
}