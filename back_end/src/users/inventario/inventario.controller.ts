import { Body, Controller, Get, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // Ajusta el path si es necesario
import { createInventarioDto } from '../dto/createInventario.dto';
import { updateInventarioDto } from '../dto/updateInventario.dto';
import { InventarioService } from './inventario.service';

@UseGuards(JwtAuthGuard)
@Controller('inventario')
export class InventarioController {
    constructor(private readonly service: InventarioService) {}

    @Get()
    get() {
        return this.service.findAll();
    }

    @Get('me')
    getMyInventario(@Request() req) {
        return this.service.findByUsuarioId(req.user.userId);
    }

    @Post('me')
    createInventario(@Body() dto: createInventarioDto, @Request() req) {
        return this.service.create(req.user.userId, dto);
    }

    @Patch('me')
    updateInventario(@Body() dto: updateInventarioDto, @Request() req) {
        return this.service.updateByUsuarioId(req.user.userId, dto);
    }
}
