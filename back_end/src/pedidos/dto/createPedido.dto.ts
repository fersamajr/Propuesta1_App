import { IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class createPedidoDto{
    @IsNotEmpty()
    @IsDate()
    fechaEntrega: Date
    
    @IsOptional()
    entregado?: boolean;

    @IsOptional()
    pagado?: boolean;

    @IsOptional()
    notas?: string
}