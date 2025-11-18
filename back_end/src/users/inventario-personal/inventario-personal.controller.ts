import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { createInventarioPersonalDto } from '../dto/createInventarioPersonal.dto';
import { updateInventarioPersonalDto } from '../dto/updateInventarioPersonal.dto';
import { InventarioPersonalService } from './inventario-personal.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inventario-personal')
export class InventarioPersonalController {
    constructor(private readonly service: InventarioPersonalService) {}

    @Get()
    getAll() {
        return this.service.findAll();
    }

    @Get('me')
    getMyInventario(@Request() req) {
        return this.service.findByUsuarioId(req.user.userId);
    }

    @Post('me')
    createInventario(@Body() dto: createInventarioPersonalDto, @Request() req) {
        return this.service.create(req.user.userId, dto);
    }

    @Patch('me')
    updateInventario(@Body() dto: updateInventarioPersonalDto, @Request() req) {
        return this.service.updateByUsuarioId(req.user.userId, dto);
    }
}
