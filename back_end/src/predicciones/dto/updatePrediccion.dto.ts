import { IsIn, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updatePrediccionDto{
    @IsNumber()
    @IsOptional()
    cantidad: number

    @IsOptional()
    fecha: Date;

    @IsNumber()
    @IsOptional()
    pedidoId: number

    @IsOptional()
    asociadaAPedido: boolean
}