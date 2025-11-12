import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updateSolicitudPedidoDto{
    @IsNumber()
    @IsOptional()
    grano?: number

    @IsNumber()
    @IsOptional()
    molido?: number
    
    @IsOptional()
    fechaEntrega?: Date

    @IsOptional()
    notas?: string

    @IsOptional()
    entregado?:boolean

    @IsOptional()
    confirmado?:boolean
}