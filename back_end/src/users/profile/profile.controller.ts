import { Body, Controller, Get, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // Ajusta el path si es necesario
import { createProfileDto } from '../dto/createProfile.dto';
import { updateProfileDto } from '../dto/updateProfile.dto';
import { ProfileService } from './profile.service';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly service: ProfileService) {}
    @Get()
    get() {
        // Acceso correcto al id del usuario autenticado
        return this.service.findAll(); // <-- Cambiado
    }
    @Get('me')
    getMyProfile(@Request() req) {
        // Acceso correcto al id del usuario autenticado
        return this.service.findOneByUsuarioId(req.user.userId); // <-- Cambiado
    }

    @Post('me')
    createProfile(@Body() dto: createProfileDto, @Request() req) {
        return this.service.create(req.user.userId, dto); // <-- Cambiado
    }

    @Patch('me')
    updateProfile(@Body() dto: updateProfileDto, @Request() req) {
        return this.service.updateByUsuarioId(req.user.userId, dto);
    }
}

