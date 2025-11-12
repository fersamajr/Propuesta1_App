import { IsIn, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { rolUser } from '../entity/User.entity';

export class uptadeUserDto{
    @IsString()
    @MinLength(6)
    @IsOptional()
    username? : string

    @IsString()
    @MinLength(6)
    @IsOptional()
    contrasena? : string

    @IsString()
    @IsOptional()
    @IsIn([rolUser.admin,rolUser.cliente])
    rol? : rolUser
}
