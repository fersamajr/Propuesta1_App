import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createInventarioPersonalDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    producto : string

    @IsNumber()
    @IsNotEmpty()
    cantidad : number

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    cantidadAnterior: string

    @IsOptional()
    fechaAnterior?: string
}