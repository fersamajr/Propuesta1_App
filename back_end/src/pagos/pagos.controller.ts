import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { createPagoDto } from './dto/CreatePago.dto';
import { updatePagoDto } from './dto/UpdatePago.dto';
import { PagosService } from './pagos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@UseGuards(JwtAuthGuard) // ⬅️ Proteger la ruta
@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService) {}
    @Get('me') // ⬅️ Nueva ruta para obtener mis pagos

    getMyPagos(@Request() req) {
        const userId = req.user.userId; // Extraer el userId del token
        return this.pagosService.findByUsuarioId(userId); // Llamar al nuevo método del servicio
    }
    @Post()
    createPago(@Body() dto: createPagoDto) {
        return this.pagosService.createPago(dto);
    }

    @Get()
    getPagos() {
        return this.pagosService.findAll();
    }

    @Get(':id')
    getPago(@Param('id') id: string) {
        return this.pagosService.findOne(String(id));
    }

    @Patch(':id')
    updatePago(@Param('id') id: string, @Body() dto: updatePagoDto) {
        return this.pagosService.update(String(id), dto);
    }

    @Delete(':id')
    removePago(@Param('id') id: string) {
        return this.pagosService.remove(String(id));
    }
}
