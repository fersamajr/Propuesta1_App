import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createProfileDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    firstname : string

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    lastname : string

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    restaurante: string

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    direccion: string

    @IsNumber()
    @IsNotEmpty()
    precioAcordado: number

    @IsOptional()
    notas?: string
}