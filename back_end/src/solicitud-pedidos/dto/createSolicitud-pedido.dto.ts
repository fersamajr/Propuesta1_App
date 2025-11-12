import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createSolicitudPedidoDto{
    @IsNumber()
    @IsNotEmpty()
    grano: number

    @IsNumber()
    @IsNotEmpty()
    molido: number
    
    @IsNotEmpty()
    fechaEntrega: Date

    @IsOptional()
    notas?: string

    @IsOptional()
    entregado?:boolean

    @IsOptional()
    confirmado?:boolean

    @IsNumber()
    usuarioId : number
}