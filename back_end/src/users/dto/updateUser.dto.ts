// src/users/dto/updateUser.dto.ts
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { rolUser } from '../entity/User.entity';

export class uptadeUserDto {
    @IsString()
    @MinLength(6)
    @IsOptional()
    username?: string

    @IsString()
    @MinLength(6)
    @IsOptional()
    contrasena?: string

    @IsEmail() // ⬅️ NUEVO
    @IsOptional()
    email?: string

    @IsBoolean() // ⬅️ NUEVO
    @IsOptional()
    isActive?: boolean

    @IsString()
    @IsOptional()
    @IsIn([rolUser.admin, rolUser.cliente])
    rol?: rolUser
}