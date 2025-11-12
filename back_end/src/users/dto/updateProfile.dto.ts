import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updateProfileDto{
    @IsString()
    @MinLength(3)
    @IsOptional()
    firstname? : string

    @IsString()
    @MinLength(3)
    @IsOptional()
    lastname? : string

    @IsString()
    @MinLength(3)
    @IsOptional()
    restaurante?: string

    @IsString()
    @MinLength(3)
    @IsOptional()
    direccion?: string

    @IsNumber()
    @IsOptional()
    precioAcordado?: number

    @IsOptional()
    notas?: string
}