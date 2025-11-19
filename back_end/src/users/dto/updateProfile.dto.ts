// src/users/dto/updateProfile.dto.ts
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class updateProfileDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    firstName?: string; // ⬅️ CAMBIO: firstname -> firstName

    @IsString()
    @MinLength(3)
    @IsOptional()
    lastName?: string;  // ⬅️ CAMBIO: lastname -> lastName

    @IsString()
    @MinLength(3)
    @IsOptional()
    restaurant?: string; // ⬅️ CAMBIO: restaurante -> restaurant (inglés, como la entidad)

    @IsString()
    @MinLength(3)
    @IsOptional()
    direction?: string;  // ⬅️ CAMBIO: direccion -> direction (inglés, como la entidad)

    @IsNumber()
    @IsOptional()
    precioAcordado?: number;

    @IsOptional()
    notas?: string;
}