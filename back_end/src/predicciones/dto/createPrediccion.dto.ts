import { IsIn, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createPrediccionDto{
    @IsNumber()
    @IsNotEmpty()
    cantidad: number

    @IsNotEmpty()
    fecha: Date;

    @IsNotEmpty()
    pedidoId: string

    @IsOptional()
    asociadaAPedido: boolean

    usuarioId : string
}