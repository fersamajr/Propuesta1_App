import { IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updatePedidoDto{
    @IsOptional()
    @IsDate()
    fechaEntrega?: Date
    
    @IsOptional()
    entregado?: boolean;

    @IsOptional()
    pagado?: boolean;

    @IsOptional()
    notas?: string

    @IsNumber()
    @IsOptional()
    solicitudId? : number
}