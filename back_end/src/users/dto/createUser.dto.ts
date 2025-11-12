import { IsIn, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { rolUser } from '../entity/User.entity';

export class createUserDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    username: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    contrasena : string
}