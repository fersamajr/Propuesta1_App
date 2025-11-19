import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { createPrediccionDto } from './dto/createPrediccion.dto';
import { updatePrediccionDto } from './dto/updatePrediccion.dto';
import { PrediccionesService } from './predicciones.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 

@UseGuards(JwtAuthGuard)
@Controller('predicciones')
export class PrediccionesController {
    constructor(private readonly prediccionesService: PrediccionesService) {}

    @Post()
    create(@Body() dto: createPrediccionDto) {
        return this.prediccionesService.create(dto);
    }

    // 🆕 ESTA RUTA DEBE IR PRIMERO (Antes de :id)
    @Get('analisis-desviacion')
    getDesviaciones() {
        return this.prediccionesService.getAnalisisDesviacion();
    }

    @Get('me')
    getMyPredicciones(@Request() req) {
        const userId = req.user.userId;
        return this.prediccionesService.findByUsuarioId(userId);
    }

    @Get()
    findAll() {
        return this.prediccionesService.findAll();
    }
    @Get('planeador-inventario')
    getPlaneador() {
        return this.prediccionesService.getInventoryPlanning();
    }
    // ⚠️ ESTA RUTA DEBE IR AL FINAL DE LOS GETs
    // Porque captura cualquier cosa (ej: "123", "abc") como un ID.
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.prediccionesService.findOne(String(id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: updatePrediccionDto) {
        return this.prediccionesService.update(String(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.prediccionesService.remove(String(id));
    }
}