import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updateInventarioPersonalDto{
    @IsString()
    @IsOptional()
    @MinLength(3)
    producto?: string

    @IsNumber()
    @IsOptional()
    cantidad? : number

    @IsString()
    @MinLength(3)
    @IsOptional()
    cantidadAnterior?: string

    @IsOptional()
    fechaAnterior?: string
}