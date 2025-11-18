import { IsIn, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updatePrediccionDto{
    @IsNumber()
    @IsOptional()
    cantidad: number

    @IsOptional()
    fecha: Date;


    @IsOptional()
    pedidoId: string

    @IsOptional()
    asociadaAPedido: boolean
}