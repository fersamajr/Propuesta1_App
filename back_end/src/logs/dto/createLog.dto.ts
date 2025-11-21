import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateLogCambiosDto {
    @IsOptional()
    @IsString()
    updated_at?: Date; // O usa Date si envías en ese formato

    @IsString()
    tablaEntidadModificada: string;

    @IsNumber()
    registroId: number;

    @IsString()
    tipoOperacion: string;

    @IsObject()
    @IsOptional()
    datosAnteriores?: any;

    @IsObject()
    @IsOptional()
    datosNuevos?: any;

    @IsString()
    @IsOptional()
    descripcion?: string;
}
