import { IsIn, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createPrediccionDto{
    @IsNumber()
    @IsNotEmpty()
    cantidad: number

    @IsNotEmpty()
    fecha: Date;

    @IsOptional()
    pedidoId: string

    usuarioId : string
}