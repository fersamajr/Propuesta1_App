import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createPrediccionDto } from './dto/createPrediccion.dto';
import { updatePrediccionDto } from './dto/updatePrediccion.dto';
import { PrediccionesService } from './predicciones.service';

@Controller('predicciones')
export class PrediccionesController {
    constructor(private readonly prediccionesService: PrediccionesService) {}

    @Post()
    create(@Body() dto: createPrediccionDto) {
        return this.prediccionesService.create(dto);
    }

    @Get()
    findAll() {
        return this.prediccionesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.prediccionesService.findOne(Number(id));
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: updatePrediccionDto) {
        return this.prediccionesService.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.prediccionesService.remove(Number(id));
    }
}
